import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  useTheme as useMuiTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Person as PersonIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";
import { useTheme } from "../contexts/ThemeContext";

const API_URL = "http://localhost:5000/api";

const Profile = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    monthlyReports: true,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/user`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUserData(data);
      setFormData({
        ...formData,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSettingChange = (setting) => {
    if (setting === "darkMode") {
      toggleTheme();
    } else {
      setSettings((prev) => ({
        ...prev,
        [setting]: !prev[setting],
      }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/auth/user/update`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      await fetchUserData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/user/change-password`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to change password");
      }

      setSuccess("Password changed successfully!");
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
    setDeletePassword("");
    setDeleteError("");
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeletePasswordChange = (e) => {
    setDeletePassword(e.target.value);
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");

    if (!deletePassword) {
      setDeleteError("Please enter your password");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/user/delete-account`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: deletePassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete account");
      }

      // Clear user data from localStorage
      localStorage.removeItem("user");

      // Redirect to sign-in page
      window.location.href = "/signin";
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Profile Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6">Profile Information</Typography>
              </Box>
              <form onSubmit={handleUpdateProfile}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Update Profile
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            {/* Password Change Section */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
                  <SecurityIcon />
                </Avatar>
                <Typography variant="h6">Change Password</Typography>
              </Box>
              <form onSubmit={handleChangePassword}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary">
                      Change Password
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>

            {/* Delete Account Section */}
            <Paper sx={{ p: 3, mt: 3, bgcolor: "error.light" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: "error.main", mr: 2 }}>
                  <DeleteForeverIcon />
                </Avatar>
                <Typography variant="h6">Delete Account</Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Warning: This action cannot be undone. All your data will be
                permanently deleted.
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={handleOpenDeleteDialog}
              >
                Delete My Account
              </Button>
            </Paper>
          </Grid>

          {/* Preferences Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: "info.main", mr: 2 }}>
                  {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
                </Avatar>
                <Typography variant="h6">Preferences</Typography>
              </Box>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isDarkMode}
                        onChange={() => handleSettingChange("darkMode")}
                      />
                    }
                    label={isDarkMode ? "Dark Mode" : "Light Mode"}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {isDarkMode
                      ? "Switch to light mode for a cleaner look"
                      : "Switch to dark mode for better viewing at night"}
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={() =>
                          handleSettingChange("emailNotifications")
                        }
                      />
                    }
                    label="Email Notifications"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Receive email notifications for important updates and alerts
                  </Typography>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.monthlyReports}
                        onChange={() => handleSettingChange("monthlyReports")}
                      />
                    }
                    label="Monthly Reports"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Receive monthly financial reports and insights
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            This action cannot be undone. All your data will be permanently
            deleted. Please enter your password to confirm.
          </DialogContentText>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={deletePassword}
            onChange={handleDeletePasswordChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">
            Delete My Account
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
