import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Payment as PaymentIcon,
  SaveAlt as SaveAltIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: "",
    amount: "",
    type: "expense", // or 'income'
    date: new Date().toISOString().split("T")[0],
  });

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
      console.log("Received user data:", data);
      setUserData(data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    try {
      // Validate input
      if (!newTransaction.description || !newTransaction.amount) {
        setError("Please fill in all required fields");
        return;
      }

      // Process amount based on transaction type
      let amount = Number(newTransaction.amount);
      if (isNaN(amount) || amount <= 0) {
        setError("Please enter a valid positive amount");
        return;
      }

      // Format amount based on transaction type
      if (newTransaction.type === "expense") {
        amount = -Math.abs(amount);
      } else {
        amount = Math.abs(amount);
      }

      setLoading(true);
      const response = await fetch(`${API_URL}/auth/transactions`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newTransaction,
          amount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add transaction");
      }

      // Clear any previous errors
      setError(null);

      // Refresh user data to show new transaction
      await fetchUserData();

      // Close dialog and reset form
      setOpenDialog(false);
      setNewTransaction({
        description: "",
        amount: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error("Error adding transaction:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography color="error" variant="h6">
            Error: {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Welcome back, {userData?.firstName}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's an overview of your financial status
            </Typography>
          </Paper>
        </Grid>

        {/* Financial Overview Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Balance</Typography>
              </Box>
              <Typography variant="h4" component="div">
                {formatCurrency(userData?.totalBalance || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Income</Typography>
              </Box>
              <Typography variant="h4" component="div">
                {formatCurrency(userData?.monthlyIncome || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PaymentIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Expenses</Typography>
              </Box>
              <Typography variant="h4" component="div">
                {formatCurrency(userData?.monthlyExpenses || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <SaveAltIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Savings</Typography>
              </Box>
              <Typography variant="h4" component="div">
                {formatCurrency(userData?.savings || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Recent Transactions</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
              >
                Add Transaction
              </Button>
            </Box>
            {userData?.recentTransactions?.length > 0 ? (
              <List>
                {userData.recentTransactions.map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <ListItem>
                      <ListItemText
                        primary={transaction.description}
                        secondary={new Date(
                          transaction.date
                        ).toLocaleDateString()}
                      />
                      <Typography
                        variant="body1"
                        color={
                          transaction.amount >= 0
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        {formatCurrency(transaction.amount)}
                      </Typography>
                    </ListItem>
                    {index < userData.recentTransactions.length - 1 && (
                      <Divider />
                    )}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                No recent transactions
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add Transaction Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => !loading && setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            required
            value={newTransaction.description}
            onChange={(e) =>
              setNewTransaction({
                ...newTransaction,
                description: e.target.value,
              })
            }
            disabled={loading}
            error={!newTransaction.description && error}
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            required
            value={newTransaction.amount}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, amount: e.target.value })
            }
            disabled={loading}
            error={!newTransaction.amount && error}
            InputProps={{
              startAdornment: <span style={{ marginRight: 8 }}>₹</span>,
            }}
          />
          <TextField
            margin="dense"
            label="Type"
            select
            fullWidth
            value={newTransaction.type}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, type: e.target.value })
            }
            disabled={loading}
          >
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="income">Income</MenuItem>
          </TextField>
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            value={newTransaction.date}
            onChange={(e) =>
              setNewTransaction({ ...newTransaction, date: e.target.value })
            }
            disabled={loading}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddTransaction}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Add Transaction"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
