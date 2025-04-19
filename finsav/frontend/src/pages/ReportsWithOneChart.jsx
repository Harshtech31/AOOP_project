import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Assessment,
} from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportsWithOneChart = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Sample data for Income vs. Expenses chart
  const incomeExpenseData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Income",
        data: [5000, 5200, 5500, 5300, 5800, 6000],
        backgroundColor: theme.palette.success.main,
      },
      {
        label: "Expenses",
        data: [3800, 4200, 3900, 4100, 4300, 4000],
        backgroundColor: theme.palette.error.main,
      },
    ],
  };

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Income vs. Expenses",
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Financial Reports
        </Typography>
        <Typography variant="body1">
          Select a report type below to view your financial data.
        </Typography>
      </Paper>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab icon={<BarChartIcon />} label="Income vs. Expenses" />
        <Tab icon={<PieChartIcon />} label="Spending by Category" />
        <Tab icon={<Assessment />} label="Savings Analysis" />
      </Tabs>

      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Income vs. Expenses Report
          </Typography>
          <Box sx={{ height: 300, mt: 2 }}>
            <Bar data={incomeExpenseData} options={barOptions} />
          </Box>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Spending by Category Report
          </Typography>
          <Typography variant="body1">
            This report will show how your spending is distributed across different categories.
          </Typography>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Savings Analysis Report
          </Typography>
          <Typography variant="body1">
            This report will analyze your savings patterns and potential.
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Financial Period Summary
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ flexBasis: "100%", maxWidth: 300 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Monthly Summary
            </Typography>
            <Typography variant="body2">
              Income: ₹6,000 | Expenses: ₹4,200 | Savings: ₹1,800
            </Typography>
          </Box>
          <Box sx={{ flexBasis: "100%", maxWidth: 300 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Quarterly Results
            </Typography>
            <Typography variant="body2">
              Income: ₹18,000 | Expenses: ₹12,600 | Savings: ₹5,400
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ReportsWithOneChart;
