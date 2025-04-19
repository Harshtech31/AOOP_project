import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = "http://localhost:5000/api";

const Transactions = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  // Prepare data for charts
  const [chartData, setChartData] = useState({
    labels: [],
    income: [],
    expenses: [],
    savings: [],
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/transactions`, {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data);

      // Process data for charts
      processChartData(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (transactionsData) => {
    // For demo purposes, if no transactions, create sample data
    const sampleData =
      transactionsData.length > 0
        ? transactionsData
        : [
            { date: "2024-01-01", amount: 5000, type: "income" },
            { date: "2024-01-15", amount: -1500, type: "expense" },
            { date: "2024-02-01", amount: 5000, type: "income" },
            { date: "2024-02-10", amount: -800, type: "expense" },
            { date: "2024-02-20", amount: -1200, type: "expense" },
            { date: "2024-03-01", amount: 5000, type: "income" },
            { date: "2024-03-12", amount: -900, type: "expense" },
            { date: "2024-03-25", amount: -1100, type: "expense" },
            { date: "2024-04-01", amount: 5500, type: "income" },
            { date: "2024-04-15", amount: -1300, type: "expense" },
            { date: "2024-04-28", amount: -1000, type: "expense" },
            { date: "2024-05-01", amount: 5500, type: "income" },
            { date: "2024-05-10", amount: -1200, type: "expense" },
            { date: "2024-05-22", amount: -1100, type: "expense" },
            { date: "2024-06-01", amount: 6000, type: "income" },
            { date: "2024-06-15", amount: -1400, type: "expense" },
            { date: "2024-06-28", amount: -1200, type: "expense" },
          ];

    // Group by month
    const monthlyData = {};

    sampleData.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthYear = format(date, "MMM yyyy");

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          income: 0,
          expenses: 0,
        };
      }

      if (transaction.type === "income" || transaction.amount > 0) {
        monthlyData[monthYear].income += Math.abs(Number(transaction.amount));
      } else {
        monthlyData[monthYear].expenses += Math.abs(Number(transaction.amount));
      }
    });

    // Convert to arrays for chart
    const labels = Object.keys(monthlyData);
    const incomeData = labels.map((month) => monthlyData[month].income);
    const expensesData = labels.map((month) => monthlyData[month].expenses);
    const savingsData = labels.map(
      (month, index) => monthlyData[month].income - monthlyData[month].expenses
    );

    setChartData({
      labels,
      income: incomeData,
      expenses: expensesData,
      savings: savingsData,
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

  // Chart configurations
  const incomeChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Income",
        data: chartData.income,
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const expensesChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Expenses",
        data: chartData.expenses,
        borderColor: "#f44336",
        backgroundColor: "rgba(244, 67, 54, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const savingsChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Savings",
        data: chartData.savings,
        backgroundColor: "rgba(33, 150, 243, 0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Financial Overview",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => formatCurrency(value),
        },
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography color="error" variant="h6">
            Error: {error}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={fetchTransactions}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Financial Records
      </Typography>

      {/* Chart Tabs */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Income" />
          <Tab label="Expenses" />
          <Tab label="Savings" />
        </Tabs>

        <Box sx={{ height: 400, display: activeTab === 0 ? "block" : "none" }}>
          <Line data={incomeChartData} options={chartOptions} />
        </Box>

        <Box sx={{ height: 400, display: activeTab === 1 ? "block" : "none" }}>
          <Line data={expensesChartData} options={chartOptions} />
        </Box>

        <Box sx={{ height: 400, display: activeTab === 2 ? "block" : "none" }}>
          <Bar data={savingsChartData} options={chartOptions} />
        </Box>
      </Paper>

      {/* Transaction History */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Transaction History
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TableRow key={transaction._id || transaction.id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          transaction.type === "income"
                            ? "success.main"
                            : "error.main",
                      }}
                    >
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No transactions found. Add some transactions to see them
                    here.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Transactions;
