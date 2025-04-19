const BudgetTemplate = require('../models/BudgetTemplate');
const Budget = require('../models/Budget');

// Create predefined templates
const createPredefinedTemplates = async () => {
  try {
    // Check if templates already exist
    const templatesCount = await BudgetTemplate.countDocuments({ type: 'system' });
    if (templatesCount > 0) {
      return; // Templates already exist
    }

    // 50-30-20 Rule Template
    const fiftyThirtyTwentyTemplate = {
      name: '50-30-20 Rule',
      description: 'Allocate 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.',
      type: 'system',
      templateType: '50-30-20',
      isPublic: true,
      categories: [
        {
          name: 'Needs',
          percentage: 50,
          group: 'Essential',
          color: '#4caf50',
          subcategories: [
            { name: 'Housing', percentage: 25, color: '#81c784' },
            { name: 'Utilities', percentage: 10, color: '#a5d6a7' },
            { name: 'Groceries', percentage: 10, color: '#c8e6c9' },
            { name: 'Transportation', percentage: 5, color: '#e8f5e9' }
          ]
        },
        {
          name: 'Wants',
          percentage: 30,
          group: 'Non-essential',
          color: '#2196f3',
          subcategories: [
            { name: 'Dining Out', percentage: 10, color: '#64b5f6' },
            { name: 'Entertainment', percentage: 10, color: '#90caf9' },
            { name: 'Shopping', percentage: 5, color: '#bbdefb' },
            { name: 'Subscriptions', percentage: 5, color: '#e3f2fd' }
          ]
        },
        {
          name: 'Savings',
          percentage: 20,
          group: 'Savings',
          color: '#9c27b0',
          subcategories: [
            { name: 'Emergency Fund', percentage: 10, color: '#ba68c8' },
            { name: 'Retirement', percentage: 5, color: '#ce93d8' },
            { name: 'Debt Repayment', percentage: 5, color: '#e1bee7' }
          ]
        }
      ]
    };

    // Zero-Based Budgeting Template
    const zeroBasedTemplate = {
      name: 'Zero-Based Budget',
      description: 'Assign every dollar of your income to a specific category until your income minus expenses equals zero.',
      type: 'system',
      templateType: 'zero-based',
      isPublic: true,
      categories: [
        {
          name: 'Housing',
          percentage: 25,
          group: 'Essential',
          color: '#4caf50',
          subcategories: [
            { name: 'Rent/Mortgage', percentage: 20, color: '#81c784' },
            { name: 'Home Maintenance', percentage: 5, color: '#a5d6a7' }
          ]
        },
        {
          name: 'Utilities',
          percentage: 10,
          group: 'Essential',
          color: '#2196f3',
          subcategories: [
            { name: 'Electricity', percentage: 3, color: '#64b5f6' },
            { name: 'Water', percentage: 2, color: '#90caf9' },
            { name: 'Internet', percentage: 3, color: '#bbdefb' },
            { name: 'Phone', percentage: 2, color: '#e3f2fd' }
          ]
        },
        {
          name: 'Food',
          percentage: 15,
          group: 'Essential',
          color: '#ff9800',
          subcategories: [
            { name: 'Groceries', percentage: 10, color: '#ffb74d' },
            { name: 'Dining Out', percentage: 5, color: '#ffe0b2' }
          ]
        },
        {
          name: 'Transportation',
          percentage: 10,
          group: 'Essential',
          color: '#f44336',
          subcategories: [
            { name: 'Gas', percentage: 5, color: '#e57373' },
            { name: 'Car Maintenance', percentage: 3, color: '#ef9a9a' },
            { name: 'Public Transit', percentage: 2, color: '#ffcdd2' }
          ]
        },
        {
          name: 'Personal',
          percentage: 10,
          group: 'Non-essential',
          color: '#9c27b0',
          subcategories: [
            { name: 'Clothing', percentage: 3, color: '#ba68c8' },
            { name: 'Entertainment', percentage: 4, color: '#ce93d8' },
            { name: 'Subscriptions', percentage: 3, color: '#e1bee7' }
          ]
        },
        {
          name: 'Savings',
          percentage: 20,
          group: 'Savings',
          color: '#009688',
          subcategories: [
            { name: 'Emergency Fund', percentage: 10, color: '#4db6ac' },
            { name: 'Retirement', percentage: 10, color: '#80cbc4' }
          ]
        },
        {
          name: 'Debt Repayment',
          percentage: 10,
          group: 'Savings',
          color: '#607d8b',
          subcategories: [
            { name: 'Credit Card', percentage: 5, color: '#90a4ae' },
            { name: 'Loans', percentage: 5, color: '#b0bec5' }
          ]
        }
      ]
    };

    // Envelope System Template
    const envelopeTemplate = {
      name: 'Envelope System',
      description: 'Divide your cash into different envelopes for specific spending categories.',
      type: 'system',
      templateType: 'envelope',
      isPublic: true,
      categories: [
        {
          name: 'Housing',
          percentage: 30,
          group: 'Essential',
          color: '#4caf50'
        },
        {
          name: 'Utilities',
          percentage: 10,
          group: 'Essential',
          color: '#2196f3'
        },
        {
          name: 'Groceries',
          percentage: 15,
          group: 'Essential',
          color: '#ff9800'
        },
        {
          name: 'Transportation',
          percentage: 10,
          group: 'Essential',
          color: '#f44336'
        },
        {
          name: 'Entertainment',
          percentage: 5,
          group: 'Non-essential',
          color: '#9c27b0'
        },
        {
          name: 'Dining Out',
          percentage: 5,
          group: 'Non-essential',
          color: '#e91e63'
        },
        {
          name: 'Clothing',
          percentage: 5,
          group: 'Non-essential',
          color: '#00bcd4'
        },
        {
          name: 'Savings',
          percentage: 15,
          group: 'Savings',
          color: '#009688'
        },
        {
          name: 'Miscellaneous',
          percentage: 5,
          group: 'Other',
          color: '#607d8b'
        }
      ]
    };

    // Create the templates
    await BudgetTemplate.create([
      fiftyThirtyTwentyTemplate,
      zeroBasedTemplate,
      envelopeTemplate
    ]);

    console.log('Predefined budget templates created successfully');
  } catch (error) {
    console.error('Error creating predefined templates:', error);
  }
};

// Get all templates
exports.getTemplates = async (req, res) => {
  try {
    // Ensure predefined templates exist
    await createPredefinedTemplates();

    const userId = req.user.id;
    
    // Get system templates and user's custom templates
    const templates = await BudgetTemplate.find({
      $or: [
        { type: 'system' },
        { user: userId }
      ]
    }).sort({ createdAt: -1 });

    res.json(templates);
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const templateId = req.params.id;
    const userId = req.user.id;

    const template = await BudgetTemplate.findOne({
      _id: templateId,
      $or: [
        { type: 'system' },
        { user: userId }
      ]
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a custom template
exports.createTemplate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, categories } = req.body;

    const template = await BudgetTemplate.create({
      name,
      description,
      type: 'custom',
      user: userId,
      categories: categories || []
    });

    res.status(201).json(template);
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update a custom template
exports.updateTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const userId = req.user.id;
    const updates = req.body;

    // Ensure user can only update their own templates
    const template = await BudgetTemplate.findOne({
      _id: templateId,
      user: userId,
      type: 'custom'
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found or cannot be modified' });
    }

    // Apply updates
    Object.keys(updates).forEach(key => {
      if (key !== 'type' && key !== 'user') { // Prevent changing type or user
        template[key] = updates[key];
      }
    });

    await template.save();
    res.json(template);
  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a custom template
exports.deleteTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const userId = req.user.id;

    const template = await BudgetTemplate.findOneAndDelete({
      _id: templateId,
      user: userId,
      type: 'custom'
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found or cannot be deleted' });
    }

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create budget from template
exports.createBudgetFromTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const userId = req.user.id;
    const { name, totalBudget, period, startDate } = req.body;

    // Find the template
    const template = await BudgetTemplate.findOne({
      _id: templateId,
      $or: [
        { type: 'system' },
        { user: userId }
      ]
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Calculate end date based on period
    let endDate = new Date(startDate);
    if (period === 'weekly') {
      endDate.setDate(endDate.getDate() + 7);
    } else if (period === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (period === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Convert template categories to budget categories
    const categories = template.categories.map(cat => {
      const categoryLimit = (cat.percentage / 100) * totalBudget;
      
      // Process subcategories if they exist
      const subcategories = cat.subcategories && cat.subcategories.length > 0
        ? cat.subcategories.map(subcat => {
            const subcatLimit = (subcat.percentage / 100) * categoryLimit;
            return {
              name: subcat.name,
              limit: subcatLimit,
              spent: 0,
              color: subcat.color || cat.color,
              group: cat.group,
              isSubcategory: true,
              alertThreshold: 80
            };
          })
        : [];

      return {
        name: cat.name,
        limit: categoryLimit,
        spent: 0,
        color: cat.color,
        group: cat.group,
        isSubcategory: false,
        alertThreshold: 80,
        subcategories
      };
    });

    // Create the budget
    const budget = await Budget.create({
      user: userId,
      name,
      totalBudget,
      period,
      startDate,
      endDate,
      categories,
      templateType: template.templateType,
      isTemplate: false
    });

    res.status(201).json(budget);
  } catch (error) {
    console.error('Create budget from template error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Save budget as template
exports.saveBudgetAsTemplate = async (req, res) => {
  try {
    const budgetId = req.params.id;
    const userId = req.user.id;
    const { name, description } = req.body;

    // Find the budget
    const budget = await Budget.findOne({
      _id: budgetId,
      user: userId
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Convert budget categories to template categories
    const totalBudget = budget.totalBudget;
    const categories = budget.categories.map(cat => {
      const percentage = (cat.limit / totalBudget) * 100;
      
      return {
        name: cat.name,
        percentage,
        group: cat.group || 'Other',
        color: cat.color
      };
    });

    // Create the template
    const template = await BudgetTemplate.create({
      name: name || `Template from ${budget.name}`,
      description: description || `Created from budget: ${budget.name}`,
      type: 'custom',
      user: userId,
      categories
    });

    res.status(201).json(template);
  } catch (error) {
    console.error('Save budget as template error:', error);
    res.status(500).json({ message: error.message });
  }
};
