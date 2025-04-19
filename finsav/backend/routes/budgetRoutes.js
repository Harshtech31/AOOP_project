const express = require("express");
const router = express.Router();
const {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  addCategory,
  updateCategory,
  deleteCategory,
  trackSpending,
  getBudgetProgress,
  updateBudgetFromTransactions,
  compareBudgets,
  getBudgetInsights,
} = require("../controllers/budgetController");
const { authenticate } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticate);

// Budget routes
router.post("/", createBudget);
router.get("/", getBudgets);
router.get("/:id", getBudgetById);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

// Category routes
router.post("/:id/categories", addCategory);
router.put("/:budgetId/categories/:categoryId", updateCategory);
router.delete("/:budgetId/categories/:categoryId", deleteCategory);

// Budget tracking routes
router.post("/track", trackSpending);
router.get("/:id/progress", getBudgetProgress);
router.post("/:id/update-from-transactions", updateBudgetFromTransactions);

// Budget analysis routes
router.get("/compare", compareBudgets);
router.get("/:id/insights", getBudgetInsights);

module.exports = router;
