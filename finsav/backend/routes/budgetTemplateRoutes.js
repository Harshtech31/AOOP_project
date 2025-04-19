const express = require('express');
const router = express.Router();
const { 
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  createBudgetFromTemplate,
  saveBudgetAsTemplate
} = require('../controllers/budgetTemplateController');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Template routes
router.get('/', getTemplates);
router.get('/:id', getTemplateById);
router.post('/', createTemplate);
router.put('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);

// Template-Budget conversion routes
router.post('/:id/create-budget', createBudgetFromTemplate);
router.post('/from-budget/:id', saveBudgetAsTemplate);

module.exports = router;
