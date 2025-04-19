const express = require('express');
const router = express.Router();
const { 
  getIncomeExpenseReport,
  getCategoryReport,
  getSavingsReport,
  exportTransactionsCSV,
  getTransactionTrends
} = require('../controllers/reportController');
const { authenticate } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticate);

// Report routes
router.get('/income-expense', getIncomeExpenseReport);
router.get('/categories', getCategoryReport);
router.get('/savings', getSavingsReport);
router.get('/trends', getTransactionTrends);
router.get('/export/csv', exportTransactionsCSV);

module.exports = router;
