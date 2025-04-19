const Transaction = require("../models/Transaction");
const User = require("../models/User");

// Add new transaction
exports.addTransaction = async (req, res) => {
  try {
    const { description, amount, date, type } = req.body;
    const userId = req.user.id;

    // Ensure amount is a number and properly formatted based on type
    let processedAmount = Number(amount);
    if (type === "expense" && processedAmount > 0) {
      processedAmount = -processedAmount; // Make expenses negative
    } else if (type === "income" && processedAmount < 0) {
      processedAmount = Math.abs(processedAmount); // Make income positive
    }

    const transaction = await Transaction.create({
      user: userId,
      description,
      amount: processedAmount,
      date,
      type,
    });

    // Update user's financial data using the new method
    const user = await User.findById(userId);
    await user.updateFinancialSummaries();

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Add transaction error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get user's transactions
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, sort = "date", order = "desc", type } = req.query;

    // Build query
    const query = { user: userId };

    // Filter by transaction type if specified
    if (type && ["income", "expense"].includes(type)) {
      query.type = type;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === "asc" ? 1 : -1;

    const transactions = await Transaction.find(query)
      .sort(sortObj)
      .limit(Number(limit));

    res.json(transactions);
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ message: error.message });
  }
};
