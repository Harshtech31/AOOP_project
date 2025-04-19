import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress,
  LinearProgress,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Alert,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
  AttachMoney as MoneyIcon,
  DateRange as DateRangeIcon,
  PieChart as PieChartIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { format } from "date-fns";

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, Legend);

const API_URL = "http://localhost:5000/api";

// Predefined category colors
const categoryColors = [
  "#4caf50", // Green
  "#f44336", // Red
  "#2196f3", // Blue
  "#ff9800", // Orange
  "#9c27b0", // Purple
  "#00bcd4", // Cyan
  "#ffeb3b", // Yellow
  "#795548", // Brown
  "#607d8b", // Blue Grey
  "#e91e63", // Pink
];

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openBudgetDialog, setOpenBudgetDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [budgetProgress, setBudgetProgress] = useState(null);

  // Form states
  const [budgetForm, setBudgetForm] = useState({
    name: "",
    totalBudget: "",
    period: "monthly",
    startDate: new Date().toISOString().split("T")[0],
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    limit: "",
    color: categoryColors[0],
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/budgets`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch budgets");
      }

      const data = await response.json();
      setBudgets(data);

      // If there are budgets, select the first one
      if (data.length > 0) {
        setSelectedBudget(data[0]);
        fetchBudgetProgress(data[0]._id);
      }
    } catch (err) {
      console.error("Error fetching budgets:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetProgress = async (budgetId) => {
    try {
      const response = await fetch(`${API_URL}/budgets/${budgetId}/progress`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch budget progress");
      }

      const data = await response.json();
      setBudgetProgress(data);
    } catch (err) {
      console.error("Error fetching budget progress:", err);
      setError(err.message);
    }
  };

  const handleBudgetSubmit = async () => {
    try {
      const method = editMode ? "PUT" : "POST";
      const url = editMode
        ? `${API_URL}/budgets/${selectedBudget._id}`
        : `${API_URL}/budgets`;

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(budgetForm),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editMode ? "update" : "create"} budget`);
      }

      const data = await response.json();

      if (editMode) {
        setBudgets(budgets.map((b) => (b._id === data._id ? data : b)));
        setSelectedBudget(data);
      } else {
        setBudgets([...budgets, data]);
        setSelectedBudget(data);
      }

      setOpenBudgetDialog(false);
      resetBudgetForm();
      setEditMode(false);
      fetchBudgetProgress(data._id);
    } catch (err) {
      console.error(`Error ${editMode ? "updating" : "creating"} budget:`, err);
      setError(err.message);
    }
  };

  const handleCategorySubmit = async () => {
    try {
      const response = await fetch(
        `${API_URL}/budgets/${selectedBudget._id}/categories`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(categoryForm),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      const data = await response.json();
      setBudgets(budgets.map((b) => (b._id === data._id ? data : b)));
      setSelectedBudget(data);
      setOpenCategoryDialog(false);
      resetCategoryForm();
      fetchBudgetProgress(data._id);
    } catch (err) {
      console.error("Error adding category:", err);
      setError(err.message);
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    try {
      const response = await fetch(`${API_URL}/budgets/${budgetId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete budget");
      }

      const updatedBudgets = budgets.filter((b) => b._id !== budgetId);
      setBudgets(updatedBudgets);

      if (updatedBudgets.length > 0) {
        setSelectedBudget(updatedBudgets[0]);
        fetchBudgetProgress(updatedBudgets[0]._id);
      } else {
        setSelectedBudget(null);
        setBudgetProgress(null);
      }
    } catch (err) {
      console.error("Error deleting budget:", err);
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      const response = await fetch(
        `${API_URL}/budgets/${selectedBudget._id}/categories/${categoryId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      const data = await response.json();
      setBudgets(budgets.map((b) => (b._id === data._id ? data : b)));
      setSelectedBudget(data);
      fetchBudgetProgress(data._id);
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(err.message);
    }
  };

  const handleUpdateFromTransactions = async () => {
    try {
      const response = await fetch(
        `${API_URL}/budgets/${selectedBudget._id}/update-from-transactions`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update budget from transactions");
      }

      const data = await response.json();
      setBudgets(budgets.map((b) => (b._id === data._id ? data : b)));
      setSelectedBudget(data);
      fetchBudgetProgress(data._id);
    } catch (err) {
      console.error("Error updating from transactions:", err);
      setError(err.message);
    }
  };

  const handleEditBudget = (budget) => {
    setBudgetForm({
      name: budget.name,
      totalBudget: budget.totalBudget,
      period: budget.period,
      startDate: new Date(budget.startDate).toISOString().split("T")[0],
    });
    setEditMode(true);
    setOpenBudgetDialog(true);
  };

  const resetBudgetForm = () => {
    setBudgetForm({
      name: "",
      totalBudget: "",
      period: "monthly",
      startDate: new Date().toISOString().split("T")[0],
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: "",
      limit: "",
      color: categoryColors[0],
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd MMM yyyy");
  };

  // Prepare chart data
  const chartData = {
    labels: budgetProgress?.categories.map((cat) => cat.name) || [],
    datasets: [
      {
        label: "Budget Allocation",
        data: budgetProgress?.categories.map((cat) => cat.limit) || [],
        backgroundColor:
          budgetProgress?.categories.map((cat) => cat.color) || [],
        borderWidth: 1,
      },
    ],
  };

  const spentChartData = {
    labels: budgetProgress?.categories.map((cat) => cat.name) || [],
    datasets: [
      {
        label: "Spent Amount",
        data: budgetProgress?.categories.map((cat) => cat.spent) || [],
        backgroundColor:
          budgetProgress?.categories.map((cat) => cat.color) || [],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: activeTab === 0 ? "Budget Allocation" : "Spending by Category",
      },
    },
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button color="inherit" size="small" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Budget Planner</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            resetBudgetForm();
            setEditMode(false);
            setOpenBudgetDialog(true);
          }}
        >
          Create Budget
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Budget List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Your Budgets
            </Typography>
            {budgets.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                No budgets found. Create your first budget to get started.
              </Typography>
            ) : (
              <List>
                {budgets.map((budget) => (
                  <React.Fragment key={budget._id}>
                    <ListItem
                      button
                      selected={selectedBudget?._id === budget._id}
                      onClick={() => {
                        setSelectedBudget(budget);
                        fetchBudgetProgress(budget._id);
                      }}
                    >
                      <ListItemText
                        primary={budget.name}
                        secondary={
                          <>
                            {formatCurrency(budget.totalBudget)} •{" "}
                            {budget.period}
                            <br />
                            {formatDate(budget.startDate)} -{" "}
                            {formatDate(budget.endDate)}
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleEditBudget(budget)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteBudget(budget._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Budget Details */}
        <Grid item xs={12} md={8}>
          {selectedBudget ? (
            <>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">
                    {selectedBudget.name} Overview
                  </Typography>
                  <Box>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={handleUpdateFromTransactions}
                      sx={{ mr: 1 }}
                    >
                      Update from Transactions
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<CategoryIcon />}
                      onClick={() => {
                        resetCategoryForm();
                        setOpenCategoryDialog(true);
                      }}
                    >
                      Add Category
                    </Button>
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Budget
                        </Typography>
                        <Typography variant="h5">
                          {formatCurrency(budgetProgress?.totalBudget || 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Total Spent
                        </Typography>
                        <Typography variant="h5" color="error.main">
                          {formatCurrency(budgetProgress?.totalSpent || 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Remaining
                        </Typography>
                        <Typography variant="h5" color="success.main">
                          {formatCurrency(budgetProgress?.totalRemaining || 0)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Overall Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={budgetProgress?.percentage || 0}
                    color={
                      budgetProgress?.percentage > 90 ? "error" : "primary"
                    }
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2">
                      {budgetProgress?.percentage.toFixed(1) || 0}% Used
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(budgetProgress?.totalSpent || 0)} of{" "}
                      {formatCurrency(budgetProgress?.totalBudget || 0)}
                    </Typography>
                  </Box>
                </Box>

                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{ mb: 2 }}
                >
                  <Tab label="Budget Allocation" />
                  <Tab label="Spending" />
                </Tabs>

                <Box
                  sx={{
                    height: 300,
                    display: activeTab === 0 ? "block" : "none",
                  }}
                >
                  <Pie data={chartData} options={chartOptions} />
                </Box>

                <Box
                  sx={{
                    height: 300,
                    display: activeTab === 1 ? "block" : "none",
                  }}
                >
                  <Pie data={spentChartData} options={chartOptions} />
                </Box>
              </Paper>

              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Budget Categories
                </Typography>
                {selectedBudget.categories.length === 0 ? (
                  <Typography variant="body1" color="text.secondary">
                    No categories found. Add categories to track your spending.
                  </Typography>
                ) : (
                  <List>
                    {selectedBudget.categories.map((category) => {
                      const progress = budgetProgress?.categories.find(
                        (c) => c.id === category._id
                      );
                      return (
                        <React.Fragment key={category._id}>
                          <ListItem>
                            <Box sx={{ width: "100%" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      borderRadius: "50%",
                                      bgcolor: category.color,
                                      mr: 1,
                                    }}
                                  />
                                  <Typography variant="subtitle1">
                                    {category.name}
                                  </Typography>
                                </Box>
                                <IconButton
                                  edge="end"
                                  onClick={() =>
                                    handleDeleteCategory(category._id)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                              <Box sx={{ mt: 1 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={progress?.percentage || 0}
                                  color={
                                    progress?.percentage > 90
                                      ? "error"
                                      : "primary"
                                  }
                                  sx={{ height: 8, borderRadius: 4 }}
                                />
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mt: 0.5,
                                  }}
                                >
                                  <Typography variant="body2">
                                    {progress?.percentage.toFixed(1) || 0}% Used
                                  </Typography>
                                  <Typography variant="body2">
                                    {formatCurrency(progress?.spent || 0)} of{" "}
                                    {formatCurrency(category.limit)}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      );
                    })}
                  </List>
                )}
              </Paper>
            </>
          ) : (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                No Budget Selected
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Select a budget from the list or create a new one to get
                started.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  resetBudgetForm();
                  setEditMode(false);
                  setOpenBudgetDialog(true);
                }}
              >
                Create Budget
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Create/Edit Budget Dialog */}
      <Dialog
        open={openBudgetDialog}
        onClose={() => setOpenBudgetDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Edit Budget" : "Create New Budget"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Budget Name"
            fullWidth
            value={budgetForm.name}
            onChange={(e) =>
              setBudgetForm({ ...budgetForm, name: e.target.value })
            }
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Total Budget Amount"
            type="number"
            fullWidth
            value={budgetForm.totalBudget}
            onChange={(e) =>
              setBudgetForm({ ...budgetForm, totalBudget: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
            <InputLabel>Budget Period</InputLabel>
            <Select
              value={budgetForm.period}
              label="Budget Period"
              onChange={(e) =>
                setBudgetForm({ ...budgetForm, period: e.target.value })
              }
            >
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            value={budgetForm.startDate}
            onChange={(e) =>
              setBudgetForm({ ...budgetForm, startDate: e.target.value })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBudgetDialog(false)}>Cancel</Button>
          <Button
            onClick={handleBudgetSubmit}
            variant="contained"
            color="primary"
          >
            {editMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog
        open={openCategoryDialog}
        onClose={() => setOpenCategoryDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Budget Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={categoryForm.name}
            onChange={(e) =>
              setCategoryForm({ ...categoryForm, name: e.target.value })
            }
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Spending Limit"
            type="number"
            fullWidth
            value={categoryForm.limit}
            onChange={(e) =>
              setCategoryForm({ ...categoryForm, limit: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₹</InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category Color</InputLabel>
            <Select
              value={categoryForm.color}
              label="Category Color"
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, color: e.target.value })
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      bgcolor: selected,
                      mr: 1,
                    }}
                  />
                  {selected}
                </Box>
              )}
            >
              {categoryColors.map((color) => (
                <MenuItem key={color} value={color}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      bgcolor: color,
                      mr: 1,
                    }}
                  />
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCategorySubmit}
            variant="contained"
            color="primary"
          >
            Add Category
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Budgets;
