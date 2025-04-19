const mongoose = require('mongoose');

const templateCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  group: {
    type: String,
    enum: ['Essential', 'Non-essential', 'Savings', 'Income', 'Other'],
    default: 'Other',
  },
  color: {
    type: String,
    default: '#3f51b5',
  },
  subcategories: [{
    name: {
      type: String,
      required: true,
      trim: true,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    color: {
      type: String,
    },
  }],
});

const budgetTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['system', 'custom'],
    default: 'custom',
  },
  templateType: {
    type: String,
    enum: ['custom', '50-30-20', 'zero-based', 'envelope'],
    default: 'custom',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  categories: [templateCategorySchema],
  isPublic: {
    type: Boolean,
    default: false,
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
budgetTemplateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('BudgetTemplate', budgetTemplateSchema);
