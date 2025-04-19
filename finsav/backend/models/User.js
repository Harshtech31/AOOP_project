const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Financial data
  totalBalance: {
    type: Number,
    default: 0,
  },
  monthlyIncome: {
    type: Number,
    default: 0,
  },
  monthlyExpenses: {
    type: Number,
    default: 0,
  },
  savings: {
    type: Number,
    default: 0,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update financial summaries
userSchema.methods.updateFinancialSummaries = async function () {
  const Transaction = require("./Transaction");
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Get all transactions for the current month
  const monthlyTransactions = await Transaction.find({
    user: this._id,
    date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
  });

  // Reset monthly figures
  this.monthlyIncome = 0;
  this.monthlyExpenses = 0;

  // Calculate monthly income and expenses
  monthlyTransactions.forEach((transaction) => {
    if (transaction.type === "income") {
      this.monthlyIncome += transaction.amount;
    } else if (transaction.type === "expense") {
      this.monthlyExpenses += Math.abs(transaction.amount);
    }
  });

  // Calculate savings
  this.savings = this.monthlyIncome - this.monthlyExpenses;

  // Get all transactions for total balance
  const allTransactions = await Transaction.find({ user: this._id });

  // Calculate total balance
  this.totalBalance = allTransactions.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  await this.save();
  return this;
};

module.exports = mongoose.model("User", userSchema);
