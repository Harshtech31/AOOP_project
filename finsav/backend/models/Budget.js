const mongoose = require("mongoose");

const budgetCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  limit: {
    type: Number,
    required: true,
    min: 0,
  },
  spent: {
    type: Number,
    default: 0,
    min: 0,
  },
  color: {
    type: String,
    default: "#3f51b5", // Default color
  },
  group: {
    type: String,
    enum: ["Essential", "Non-essential", "Savings", "Income", "Other"],
    default: "Other",
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget.categories",
    default: null,
  },
  isSubcategory: {
    type: Boolean,
    default: false,
  },
  alertThreshold: {
    type: Number,
    min: 0,
    max: 100,
    default: 80, // Alert when 80% of budget is used
  },
});

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  totalBudget: {
    type: Number,
    required: true,
    min: 0,
  },
  period: {
    type: String,
    enum: ["weekly", "monthly", "yearly"],
    default: "monthly",
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  categories: [budgetCategorySchema],
  isTemplate: {
    type: Boolean,
    default: false,
  },
  templateType: {
    type: String,
    enum: ["custom", "50-30-20", "zero-based", "envelope"],
    default: "custom",
  },
  templateDescription: {
    type: String,
    trim: true,
  },
  previousBudget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
    default: null,
  },
  notes: {
    type: String,
    trim: true,
  },
  notifications: {
    enabled: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: false,
    },
    weeklyDigest: {
      type: Boolean,
      default: false,
    },
    thresholdAlerts: {
      type: Boolean,
      default: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
budgetSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Budget", budgetSchema);
