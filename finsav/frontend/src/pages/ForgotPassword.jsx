import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  Alert,
  CircularProgress,
} from "@mui/material";

const API_URL = "http://localhost:5000/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleTokenChange = (e) => {
    setResetToken(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to request password reset");
      }

      setSuccess(true);
      setShowResetForm(true);

      // In development mode, the server returns the token in the response
      if (data.token) {
        setResetToken(data.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token: resetToken,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setResetSuccess(true);
      setShowResetForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            {resetSuccess
              ? "Password Reset Successful"
              : showResetForm
              ? "Reset Your Password"
              : "Forgot Password"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && !resetSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset email sent. Please check your inbox for the reset
              code.
              {resetToken && (
                <Box
                  sx={{
                    mt: 1,
                    p: 1,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    Development mode: Your reset code is{" "}
                    <Box component="span" sx={{ color: "primary.main" }}>
                      {resetToken}
                    </Box>
                  </Typography>
                </Box>
              )}
            </Alert>
          )}

          {resetSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your password has been reset successfully.
            </Alert>
          )}

          {!showResetForm && !resetSuccess && (
            <Box component="form" onSubmit={handleRequestReset} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Request Password Reset"
                )}
              </Button>
            </Box>
          )}

          {showResetForm && !resetSuccess && (
            <Box component="form" onSubmit={handleResetPassword} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="resetToken"
                label="Reset Code"
                name="resetToken"
                autoFocus
                value={resetToken}
                onChange={handleTokenChange}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                disabled={loading}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                disabled={loading}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Reset Password"}
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 2, textAlign: "center" }}>
            {resetSuccess ? (
              <Link component={RouterLink} to="/signin" variant="body2">
                Return to Sign In
              </Link>
            ) : (
              <Link component={RouterLink} to="/signin" variant="body2">
                Remember your password? Sign In
              </Link>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
