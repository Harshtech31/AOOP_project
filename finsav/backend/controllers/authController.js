const User = require("../models/User");
const Session = require("../models/Session");
const PasswordReset = require("../models/PasswordReset");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    // Create session
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await Session.create({
      session_id: sessionId,
      user_id: user._id,
      expires_at: expiresAt,
    });

    // Set cookie
    res.cookie("sessionId", sessionId, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Signin Controller
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create session
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await Session.create({
      session_id: sessionId,
      user_id: user._id,
      expires_at: expiresAt,
    });

    // Set cookie
    res.cookie("sessionId", sessionId, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Signout Controller
exports.signout = async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (sessionId) {
      // Revoke session
      await Session.findOneAndUpdate(
        { session_id: sessionId },
        { is_revoked: true }
      );

      // Clear cookie
      res.clearCookie("sessionId");
    }

    res.status(200).json({ success: true, message: "Signed out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Data Controller
exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "firstName lastName email createdAt totalBalance monthlyIncome monthlyExpenses savings"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get recent transactions
    const Transaction = require("../models/Transaction");
    const recentTransactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(10);

    // Calculate savings (if not already stored)
    const savings = user.monthlyIncome - user.monthlyExpenses;

    // Prepare user data with real transactions
    const userData = {
      ...user.toObject(),
      savings: user.savings || savings,
      recentTransactions: recentTransactions.map((transaction) => ({
        id: transaction._id,
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type,
      })),
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error("Get user data error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.user.id;

    // Check if email is already taken
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist" });
    }

    // Generate a random token
    const token = crypto.randomBytes(3).toString("hex").toUpperCase();

    // Save token to database
    await PasswordReset.findOneAndDelete({ email }); // Remove any existing token
    await PasswordReset.create({
      email,
      token,
    });

    // In a real application, you would send an email with the token
    // For this demo, we'll just return the token in the response
    console.log(`Password reset token for ${email}: ${token}`);

    res.json({
      message: "Password reset email sent",
      // Only for development - remove in production
      token: token,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    // Find the valid reset token
    const passwordReset = await PasswordReset.findOne({ email, token });
    if (!passwordReset) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the password
    user.password = newPassword;
    await user.save();

    // Delete the reset token
    await PasswordReset.findOneAndDelete({ email });

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete User Account
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Delete user's sessions
    await Session.deleteMany({ user_id: userId });

    // Delete user's password reset tokens if any
    await PasswordReset.deleteMany({ email: user.email });

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Clear session cookie
    res.clearCookie("sessionId");

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: error.message });
  }
};
