const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

// Create a new budget
exports.createBudget = async (req, res) => {
  try {
    const { name, totalBudget, period, startDate, categories } = req.body;
    const userId = req.user.id;

    // Calculate end date based on period
    let endDate = new Date(startDate);
    if (period === "weekly") {
      endDate.setDate(endDate.getDate() + 7);
    } else if (period === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (period === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const budget = await Budget.create({
      user: userId,
      name,
      totalBudget,
      period,
      startDate,
      endDate,
      categories: categories || [],
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error("Create budget error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all budgets for a user
exports.getBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgets = await Budget.find({ user: userId }).sort({ createdAt: -1 });

    res.json(budgets);
  } catch (error) {
    console.error("Get budgets error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single budget by ID
exports.getBudgetById = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = req.params.id;

    const budget = await Budget.findOne({ _id: budgetId, user: userId });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json(budget);
  } catch (error) {
    console.error("Get budget error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update a budget
exports.updateBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = req.params.id;
    const updates = req.body;

    // Ensure the user can't update the user field
    delete updates.user;

    // Calculate end date if period or startDate is updated
    if (updates.period || updates.startDate) {
      const startDate = updates.startDate
        ? new Date(updates.startDate)
        : budget.startDate;
      const period = updates.period || budget.period;

      let endDate = new Date(startDate);
      if (period === "weekly") {
        endDate.setDate(endDate.getDate() + 7);
      } else if (period === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (period === "yearly") {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      updates.endDate = endDate;
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: budgetId, user: userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json(budget);
  } catch (error) {
    console.error("Update budget error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = req.params.id;

    const budget = await Budget.findOneAndDelete({
      _id: budgetId,
      user: userId,
    });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Delete budget error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Add a category to a budget
exports.addCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = req.params.id;
    const { name, limit, color } = req.body;

    const budget = await Budget.findOne({ _id: budgetId, user: userId });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    budget.categories.push({ name, limit, spent: 0, color });
    await budget.save();

    res.status(201).json(budget);
  } catch (error) {
    console.error("Add category error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update a category in a budget
exports.updateCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { budgetId, categoryId } = req.params;
    const updates = req.body;

    const budget = await Budget.findOne({ _id: budgetId, user: userId });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const category = budget.categories.id(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update category fields
    Object.keys(updates).forEach((key) => {
      if (key !== "_id") {
        category[key] = updates[key];
      }
    });

    await budget.save();
    res.json(budget);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a category from a budget
exports.deleteCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { budgetId, categoryId } = req.params;

    const budget = await Budget.findOne({ _id: budgetId, user: userId });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    budget.categories.id(categoryId).remove();
    await budget.save();

    res.json(budget);
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Track spending against budget
exports.trackSpending = async (req, res) => {
  try {
    const userId = req.user.id;
    const { budgetId, categoryId, amount } = req.body;

    const budget = await Budget.findOne({ _id: budgetId, user: userId });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const category = budget.categories.id(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update spent amount
    category.spent += Number(amount);
    await budget.save();

    res.json(budget);
  } catch (error) {
    console.error("Track spending error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get budget progress
exports.getBudgetProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = req.params.id;

    const budget = await Budget.findOne({ _id: budgetId, user: userId });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Calculate total spent
    const totalSpent = budget.categories.reduce(
      (sum, category) => sum + category.spent,
      0
    );

    // Calculate progress for each category
    const categoriesProgress = budget.categories.map((category) => ({
      id: category._id,
      name: category.name,
      limit: category.limit,
      spent: category.spent,
      remaining: category.limit - category.spent,
      percentage: Math.min(100, (category.spent / category.limit) * 100),
      color: category.color,
    }));

    // Calculate overall budget progress
    const progress = {
      totalBudget: budget.totalBudget,
      totalSpent,
      totalRemaining: budget.totalBudget - totalSpent,
      percentage: Math.min(100, (totalSpent / budget.totalBudget) * 100),
      categories: categoriesProgress,
    };

    res.json(progress);
  } catch (error) {
    console.error("Get budget progress error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update budget with actual spending from transactions
exports.updateBudgetFromTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = req.params.id;

    const budget = await Budget.findOne({ _id: budgetId, user: userId });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Get transactions within the budget period
    const transactions = await Transaction.find({
      user: userId,
      type: "expense",
      date: { $gte: budget.startDate, $lte: budget.endDate },
    });

    // Reset spent amounts
    budget.categories.forEach((category) => {
      category.spent = 0;
    });

    // Map transactions to categories (simplified - in a real app, you'd need a way to map transactions to categories)
    transactions.forEach((transaction) => {
      // This is a simplified example - you'd need a more sophisticated way to map transactions to categories
      const categoryName = transaction.description.toLowerCase();
      const category = budget.categories.find((cat) =>
        categoryName.includes(cat.name.toLowerCase())
      );

      if (category) {
        category.spent += Math.abs(transaction.amount);
      }
    });

    // Check for threshold alerts
    const alerts = [];
    if (budget.notifications && budget.notifications.thresholdAlerts) {
      budget.categories.forEach((category) => {
        const spentPercentage = (category.spent / category.limit) * 100;
        if (spentPercentage >= category.alertThreshold) {
          alerts.push({
            category: category.name,
            limit: category.limit,
            spent: category.spent,
            percentage: spentPercentage,
            threshold: category.alertThreshold,
          });
        }
      });
    }

    await budget.save();
    res.json({
      budget,
      alerts,
    });
  } catch (error) {
    console.error("Update budget from transactions error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Compare budgets
exports.compareBudgets = async (req, res) => {
  try {
    const userId = req.user.id;
    const { budgetId1, budgetId2 } = req.query;

    if (!budgetId1 || !budgetId2) {
      return res
        .status(400)
        .json({ message: "Two budget IDs are required for comparison" });
    }

    // Get both budgets
    const budget1 = await Budget.findOne({ _id: budgetId1, user: userId });
    const budget2 = await Budget.findOne({ _id: budgetId2, user: userId });

    if (!budget1 || !budget2) {
      return res.status(404).json({ message: "One or both budgets not found" });
    }

    // Get progress data for both budgets
    const progress1 = await calculateBudgetProgress(budget1);
    const progress2 = await calculateBudgetProgress(budget2);

    // Compare total budget and spending
    const totalComparison = {
      budget1: {
        name: budget1.name,
        period: budget1.period,
        totalBudget: budget1.totalBudget,
        totalSpent: progress1.totalSpent,
        totalRemaining: progress1.totalRemaining,
        percentage: progress1.percentage,
      },
      budget2: {
        name: budget2.name,
        period: budget2.period,
        totalBudget: budget2.totalBudget,
        totalSpent: progress2.totalSpent,
        totalRemaining: progress2.totalRemaining,
        percentage: progress2.percentage,
      },
      difference: {
        totalBudget: budget2.totalBudget - budget1.totalBudget,
        totalSpent: progress2.totalSpent - progress1.totalSpent,
        totalRemaining: progress2.totalRemaining - progress1.totalRemaining,
        percentage: progress2.percentage - progress1.percentage,
      },
    };

    // Compare categories
    const categoryComparison = [];

    // Get all unique category names from both budgets
    const allCategories = new Set([
      ...budget1.categories.map((cat) => cat.name),
      ...budget2.categories.map((cat) => cat.name),
    ]);

    // Compare each category
    allCategories.forEach((categoryName) => {
      const category1 = budget1.categories.find(
        (cat) => cat.name === categoryName
      );
      const category2 = budget2.categories.find(
        (cat) => cat.name === categoryName
      );

      const categoryProgress1 = category1
        ? progress1.categories.find((cat) => cat.name === categoryName)
        : null;
      const categoryProgress2 = category2
        ? progress2.categories.find((cat) => cat.name === categoryName)
        : null;

      categoryComparison.push({
        name: categoryName,
        budget1: category1
          ? {
              limit: category1.limit,
              spent: category1.spent,
              remaining: categoryProgress1 ? categoryProgress1.remaining : 0,
              percentage: categoryProgress1 ? categoryProgress1.percentage : 0,
            }
          : null,
        budget2: category2
          ? {
              limit: category2.limit,
              spent: category2.spent,
              remaining: categoryProgress2 ? categoryProgress2.remaining : 0,
              percentage: categoryProgress2 ? categoryProgress2.percentage : 0,
            }
          : null,
        difference: {
          limit:
            (category2 ? category2.limit : 0) -
            (category1 ? category1.limit : 0),
          spent:
            (category2 ? category2.spent : 0) -
            (category1 ? category1.spent : 0),
          remaining:
            (categoryProgress2 ? categoryProgress2.remaining : 0) -
            (categoryProgress1 ? categoryProgress1.remaining : 0),
          percentage:
            (categoryProgress2 ? categoryProgress2.percentage : 0) -
            (categoryProgress1 ? categoryProgress1.percentage : 0),
        },
      });
    });

    res.json({
      totalComparison,
      categoryComparison,
    });
  } catch (error) {
    console.error("Compare budgets error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get budget insights
exports.getBudgetInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetId = req.params.id;

    const budget = await Budget.findOne({ _id: budgetId, user: userId });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Get transactions for this budget period
    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: budget.startDate, $lte: budget.endDate },
    }).sort({ date: 1 });

    // Get previous budget if available
    const previousBudget = budget.previousBudget
      ? await Budget.findById(budget.previousBudget)
      : null;

    // Calculate budget progress
    const progress = await calculateBudgetProgress(budget);

    // Generate insights
    const insights = [];

    // Insight 1: Overall budget status
    if (progress.percentage > 90) {
      insights.push({
        type: "warning",
        title: "Budget Almost Depleted",
        description: `You've used ${progress.percentage.toFixed(
          1
        )}% of your total budget. Consider adjusting your spending for the rest of the period.`,
      });
    } else if (
      progress.percentage < 30 &&
      new Date() >
        new Date(
          budget.startDate.getTime() + (budget.endDate - budget.startDate) / 2
        )
    ) {
      insights.push({
        type: "positive",
        title: "Budget On Track",
        description: `You've only used ${progress.percentage.toFixed(
          1
        )}% of your budget and you're halfway through the period. You're doing great!`,
      });
    }

    // Insight 2: Categories approaching or exceeding limits
    const categoriesAtRisk = progress.categories.filter(
      (cat) => cat.percentage >= 80
    );
    if (categoriesAtRisk.length > 0) {
      insights.push({
        type: "warning",
        title: "Categories Approaching Limits",
        description: `${
          categoriesAtRisk.length
        } categories are at or above 80% of their budget: ${categoriesAtRisk
          .map((cat) => cat.name)
          .join(", ")}.`,
        categories: categoriesAtRisk,
      });
    }

    // Insight 3: Unusual spending patterns
    const categorySpending = {};
    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        const categoryName = findCategoryForTransaction(
          transaction,
          budget.categories
        );
        if (!categorySpending[categoryName]) {
          categorySpending[categoryName] = [];
        }
        categorySpending[categoryName].push({
          amount: Math.abs(transaction.amount),
          date: transaction.date,
        });
      }
    });

    // Look for unusual spikes in spending
    Object.keys(categorySpending).forEach((category) => {
      const transactions = categorySpending[category];
      if (transactions.length >= 3) {
        const amounts = transactions.map((t) => t.amount);
        const average =
          amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
        const highTransactions = transactions.filter(
          (t) => t.amount > average * 1.5
        );

        if (highTransactions.length > 0) {
          insights.push({
            type: "info",
            title: `Unusual Spending in ${category}`,
            description: `You had ${highTransactions.length} transactions in ${category} that were significantly higher than your average spending in this category.`,
            transactions: highTransactions,
          });
        }
      }
    });

    // Insight 4: Comparison with previous budget if available
    if (previousBudget) {
      const previousProgress = await calculateBudgetProgress(previousBudget);

      if (progress.percentage > previousProgress.percentage * 1.2) {
        insights.push({
          type: "warning",
          title: "Higher Spending Rate",
          description: `You're spending at a ${(
            (progress.percentage / previousProgress.percentage) * 100 -
            100
          ).toFixed(1)}% higher rate compared to your previous budget period.`,
        });
      } else if (progress.percentage < previousProgress.percentage * 0.8) {
        insights.push({
          type: "positive",
          title: "Lower Spending Rate",
          description: `You're spending at a ${(
            (1 - progress.percentage / previousProgress.percentage) *
            100
          ).toFixed(
            1
          )}% lower rate compared to your previous budget period. Great job!`,
        });
      }
    }

    // Insight 5: Savings potential
    const nonEssentialCategories = budget.categories.filter(
      (cat) => cat.group === "Non-essential"
    );
    if (nonEssentialCategories.length > 0) {
      const nonEssentialSpending = nonEssentialCategories.reduce(
        (sum, cat) => sum + cat.spent,
        0
      );
      const totalSpent = progress.totalSpent;

      if (nonEssentialSpending > totalSpent * 0.3) {
        insights.push({
          type: "suggestion",
          title: "Savings Opportunity",
          description: `${((nonEssentialSpending / totalSpent) * 100).toFixed(
            1
          )}% of your spending is in non-essential categories. Consider reducing spending in these areas to increase savings.`,
          categories: nonEssentialCategories,
        });
      }
    }

    res.json({
      budget: {
        name: budget.name,
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
        totalBudget: budget.totalBudget,
        totalSpent: progress.totalSpent,
        totalRemaining: progress.totalRemaining,
        percentage: progress.percentage,
      },
      insights,
    });
  } catch (error) {
    console.error("Budget insights error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate budget progress
async function calculateBudgetProgress(budget) {
  // Calculate total spent
  const totalSpent = budget.categories.reduce(
    (sum, category) => sum + category.spent,
    0
  );

  // Calculate progress for each category
  const categoriesProgress = budget.categories.map((category) => ({
    id: category._id,
    name: category.name,
    limit: category.limit,
    spent: category.spent,
    remaining: category.limit - category.spent,
    percentage: Math.min(100, (category.spent / category.limit) * 100),
    color: category.color,
    group: category.group,
  }));

  // Calculate overall budget progress
  return {
    totalBudget: budget.totalBudget,
    totalSpent,
    totalRemaining: budget.totalBudget - totalSpent,
    percentage: Math.min(100, (totalSpent / budget.totalBudget) * 100),
    categories: categoriesProgress,
  };
}

// Helper function to find category for a transaction
function findCategoryForTransaction(transaction, categories) {
  const description = transaction.description.toLowerCase();

  // Try to find a matching category
  const matchedCategory = categories.find((category) =>
    description.includes(category.name.toLowerCase())
  );

  return matchedCategory ? matchedCategory.name : "Uncategorized";
}
