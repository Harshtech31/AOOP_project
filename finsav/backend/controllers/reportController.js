const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");
const mongoose = require("mongoose");

// Get income vs expense report
exports.getIncomeExpenseReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate, period } = req.query;

    // Validate dates
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    // Set time to end of day for the end date
    end.setHours(23, 59, 59, 999);

    // Determine grouping format based on period
    let groupFormat;
    let dateFormat;

    switch (period) {
      case "daily":
        groupFormat = {
          year: { $year: "$date" },
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
        };
        dateFormat = "%Y-%m-%d";
        break;
      case "weekly":
        groupFormat = { year: { $year: "$date" }, week: { $week: "$date" } };
        dateFormat = "%Y-W%U";
        break;
      case "monthly":
      default:
        groupFormat = { year: { $year: "$date" }, month: { $month: "$date" } };
        dateFormat = "%Y-%m";
        break;
    }

    // Aggregate transactions by period and type
    const report = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            ...groupFormat,
            type: "$type",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: dateFormat,
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month" || 1,
                  day: "$_id.day" || 1,
                },
              },
            },
          },
          type: "$_id.type",
          total: 1,
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Process data for response
    const periods = [...new Set(report.map((item) => item.date))];

    const result = periods.map((period) => {
      const incomeData = report.find(
        (item) => item.date === period && item.type === "income"
      );
      const expenseData = report.find(
        (item) => item.date === period && item.type === "expense"
      );

      return {
        period,
        income: incomeData ? incomeData.total : 0,
        expense: expenseData ? Math.abs(expenseData.total) : 0,
        savings:
          (incomeData ? incomeData.total : 0) -
          (expenseData ? Math.abs(expenseData.total) : 0),
      };
    });

    res.json({
      startDate: start,
      endDate: end,
      periodType: period || "monthly",
      data: result,
    });
  } catch (error) {
    console.error("Income/Expense report error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get spending by category report
exports.getCategoryReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    // Validate dates
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    // Set time to end of day for the end date
    end.setHours(23, 59, 59, 999);

    // Get all budgets to extract categories
    const budgets = await Budget.find({
      user: new mongoose.Types.ObjectId(userId),
    });

    // Extract all unique categories
    const categories = [
      ...new Set(
        budgets.flatMap((budget) => budget.categories.map((cat) => cat.name))
      ),
    ];

    // Get all expense transactions
    const transactions = await Transaction.find({
      user: new mongoose.Types.ObjectId(userId),
      type: "expense",
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    // Map transactions to categories (simplified approach)
    const categoryMap = {};
    categories.forEach((category) => {
      categoryMap[category] = 0;
    });

    // Add an "Other" category for transactions that don't match any category
    categoryMap["Other"] = 0;

    transactions.forEach((transaction) => {
      let matched = false;

      // Simple matching logic - in a real app, you'd have a more sophisticated approach
      for (const category of categories) {
        if (
          transaction.description.toLowerCase().includes(category.toLowerCase())
        ) {
          categoryMap[category] += Math.abs(transaction.amount);
          matched = true;
          break;
        }
      }

      if (!matched) {
        categoryMap["Other"] += Math.abs(transaction.amount);
      }
    });

    // Format the result
    const result = Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);

    res.json({
      startDate: start,
      endDate: end,
      totalSpent: result.reduce((sum, item) => sum + item.amount, 0),
      data: result,
    });
  } catch (error) {
    console.error("Category report error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get monthly savings report
exports.getSavingsReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { year } = req.query;

    // Default to current year if not specified
    const reportYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(reportYear, 0, 1);
    const endDate = new Date(reportYear, 11, 31, 23, 59, 59, 999);

    // Aggregate transactions by month
    const report = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          type: "$_id.type",
          total: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    // Process data for response
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const result = months.map((month) => {
      const incomeData = report.find(
        (item) => item.month === month && item.type === "income"
      );
      const expenseData = report.find(
        (item) => item.month === month && item.type === "expense"
      );

      const income = incomeData ? incomeData.total : 0;
      const expense = expenseData ? Math.abs(expenseData.total) : 0;
      const savings = income - expense;

      return {
        month,
        monthName: new Date(reportYear, month - 1, 1).toLocaleString(
          "default",
          { month: "long" }
        ),
        income,
        expense,
        savings,
      };
    });

    // Calculate totals
    const totalIncome = result.reduce((sum, item) => sum + item.income, 0);
    const totalExpense = result.reduce((sum, item) => sum + item.expense, 0);
    const totalSavings = totalIncome - totalExpense;
    const averageMonthlySavings = totalSavings / 12;

    res.json({
      year: reportYear,
      totalIncome,
      totalExpense,
      totalSavings,
      averageMonthlySavings,
      data: result,
    });
  } catch (error) {
    console.error("Savings report error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Export transactions as CSV
exports.exportTransactionsCSV = async (req, res) => {
  try {
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    // Validate dates
    const start = startDate
      ? new Date(startDate)
      : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : new Date();

    // Set time to end of day for the end date
    end.setHours(23, 59, 59, 999);

    // Get transactions
    const transactions = await Transaction.find({
      user: new mongoose.Types.ObjectId(userId),
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    // Format for CSV
    const csvHeader = "Date,Description,Type,Amount\n";
    const csvRows = transactions
      .map((transaction) => {
        const date = new Date(transaction.date).toISOString().split("T")[0];
        const description = transaction.description.replace(/,/g, " "); // Remove commas to avoid CSV issues
        const type = transaction.type;
        const amount = Math.abs(transaction.amount);

        return `${date},"${description}",${type},${amount}`;
      })
      .join("\n");

    const csv = csvHeader + csvRows;

    // Set headers for CSV download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=transactions_${
        start.toISOString().split("T")[0]
      }_to_${end.toISOString().split("T")[0]}.csv`
    );

    res.send(csv);
  } catch (error) {
    console.error("CSV export error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get transaction trends
exports.getTransactionTrends = async (req, res) => {
  try {
    const userId = req.user.id;
    const { months } = req.query;

    // Default to last 6 months if not specified
    const numMonths = months ? parseInt(months) : 6;

    // Calculate start date (n months ago)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - numMonths);

    // Aggregate transactions by month and type
    const trends = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%Y-%m",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                },
              },
            },
          },
          type: "$_id.type",
          total: 1,
          count: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Generate all months in the range
    const allMonths = [];
    const tempDate = new Date(startDate);
    while (tempDate <= endDate) {
      allMonths.push(tempDate.toISOString().substring(0, 7)); // YYYY-MM format
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    // Process data for response
    const result = allMonths.map((month) => {
      const incomeData = trends.find(
        (item) => item.date === month && item.type === "income"
      );
      const expenseData = trends.find(
        (item) => item.date === month && item.type === "expense"
      );

      return {
        month,
        income: incomeData ? incomeData.total : 0,
        expense: expenseData ? Math.abs(expenseData.total) : 0,
        transactions:
          (incomeData ? incomeData.count : 0) +
          (expenseData ? expenseData.count : 0),
      };
    });

    // Calculate trend indicators
    const calculateTrend = (data) => {
      if (data.length < 2) return "stable";

      const current = data[data.length - 1];
      const previous = data[data.length - 2];

      const percentChange = ((current - previous) / Math.abs(previous)) * 100;

      if (percentChange > 5) return "increasing";
      if (percentChange < -5) return "decreasing";
      return "stable";
    };

    const incomeTrend = calculateTrend(result.map((item) => item.income));
    const expenseTrend = calculateTrend(result.map((item) => item.expense));
    const savingsTrend = calculateTrend(
      result.map((item) => item.income - item.expense)
    );

    res.json({
      startDate,
      endDate,
      months: numMonths,
      trends: {
        income: incomeTrend,
        expense: expenseTrend,
        savings: savingsTrend,
      },
      data: result,
    });
  } catch (error) {
    console.error("Transaction trends error:", error);
    res.status(500).json({ message: error.message });
  }
};
