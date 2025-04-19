const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  getUserData,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,
} = require("../controllers/authController");
const {
  addTransaction,
  getTransactions,
} = require("../controllers/transactionController");
const { authenticate } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.get("/user", authenticate, getUserData);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// User profile routes
router.put("/user/update", authenticate, updateProfile);
router.put("/user/change-password", authenticate, changePassword);
router.delete("/user/delete-account", authenticate, deleteAccount);

// Transaction routes
router.post("/transactions", authenticate, addTransaction);
router.get("/transactions", authenticate, getTransactions);

module.exports = router;
