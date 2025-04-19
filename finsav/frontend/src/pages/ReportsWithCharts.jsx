import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Button,
  useTheme,
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Assessment,
  Refresh,
  FileDownload,
} from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ReportsWithCharts = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [periodView, setPeriodView] = useState("all");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePeriodViewChange = (event) => {
    setPeriodView(event.target.value);
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
      {
        label: "Savings",
        data: [1200, 1000, 1600, 1200, 1500, 2000],
        backgroundColor: theme.palette.info.main,
      },
    ],
  };

  // Sample data for Category chart
  const categoryData = {
    labels: [
      "Housing",
      "Food",
      "Transportation",
      "Entertainment",
      "Utilities",
      "Others",
    ],
    datasets: [
      {
        data: [1500, 800, 600, 400, 500, 300],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
          theme.palette.error.main,
          theme.palette.warning.main,
          theme.palette.info.main,
        ],
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

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Spending by Category",
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Financial Reports</Typography>
        <Box>
          <Button variant="outlined" startIcon={<Refresh />} sx={{ mr: 1 }}>
            Refresh
          </Button>
          <Button variant="contained" startIcon={<FileDownload />}>
            Export
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Report Filters
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Filter options will appear here
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Bar data={incomeExpenseData} options={barOptions} />
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Pie data={categoryData} options={pieOptions} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Top Categories
              </Typography>
              <Box sx={{ mt: 2 }}>
                {categoryData.labels.map((category, index) => (
                  <Box
                    key={category}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor:
                            categoryData.datasets[0].backgroundColor[index],
                          mr: 1,
                        }}
                      />
                      <Typography>{category}</Typography>
                    </Box>
                    <Typography>
                      ₹{categoryData.datasets[0].data[index].toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Savings Analysis Report
              </Typography>
              <Bar
                data={{
                  labels: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  datasets: [
                    {
                      label: "Income",
                      data: [
                        5000, 5200, 5500, 5300, 5800, 6000, 5900, 6100, 6200,
                        6000, 6300, 6500,
                      ],
                      backgroundColor: theme.palette.primary.main,
                    },
                    {
                      label: "Expenses",
                      data: [
                        3800, 4200, 3900, 4100, 4300, 4000, 4200, 4400, 4100,
                        4300, 4500, 4200,
                      ],
                      backgroundColor: theme.palette.error.main,
                    },
                    {
                      label: "Savings",
                      data: [
                        1200, 1000, 1600, 1200, 1500, 2000, 1700, 1700, 2100,
                        1700, 1800, 2300,
                      ],
                      backgroundColor: theme.palette.success.main,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Monthly Savings Trend",
                    },
                  },
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Financial Period Summary Section */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6">Financial Period Summary</Typography>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="period-view-label">View Period</InputLabel>
            <Select
              labelId="period-view-label"
              id="period-view-select"
              value={periodView}
              label="View Period"
              onChange={handlePeriodViewChange}
              size="small"
            >
              <MenuItem value="all">Show All</MenuItem>
              <MenuItem value="daily">Daily Average</MenuItem>
              <MenuItem value="monthly">Monthly Summary</MenuItem>
              <MenuItem value="quarterly">Quarterly Results</MenuItem>
              <MenuItem value="yearly">Financial Year</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={3}>
          {(periodView === "all" || periodView === "daily") && (
            <Grid
              item
              xs={12}
              sm={periodView === "all" ? 6 : 12}
              md={periodView === "all" ? 3 : 6}
              lg={periodView === "all" ? 3 : 6}
            >
              <Paper elevation={2} sx={{ p: 2, bgcolor: "background.default" }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Daily Average
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Income:
                  </Typography>
                  <Typography variant="body2">₹200</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Expenses:
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    ₹140
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Savings:
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    ₹60
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}

          {(periodView === "all" || periodView === "monthly") && (
            <Grid
              item
              xs={12}
              sm={periodView === "all" ? 6 : 12}
              md={periodView === "all" ? 3 : 6}
              lg={periodView === "all" ? 3 : 6}
            >
              <Paper elevation={2} sx={{ p: 2, bgcolor: "background.default" }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Monthly Summary
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Income:
                  </Typography>
                  <Typography variant="body2">₹6,000</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Expenses:
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    ₹4,200
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Savings:
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    ₹1,800
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}

          {(periodView === "all" || periodView === "quarterly") && (
            <Grid
              item
              xs={12}
              sm={periodView === "all" ? 6 : 12}
              md={periodView === "all" ? 3 : 6}
              lg={periodView === "all" ? 3 : 6}
            >
              <Paper elevation={2} sx={{ p: 2, bgcolor: "background.default" }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Quarterly Results
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Income:
                  </Typography>
                  <Typography variant="body2">₹18,000</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Expenses:
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    ₹12,600
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Savings:
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    ₹5,400
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}

          {(periodView === "all" || periodView === "yearly") && (
            <Grid
              item
              xs={12}
              sm={periodView === "all" ? 6 : 12}
              md={periodView === "all" ? 3 : 6}
              lg={periodView === "all" ? 3 : 6}
            >
              <Paper elevation={2} sx={{ p: 2, bgcolor: "background.default" }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Financial Year
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Income:
                  </Typography>
                  <Typography variant="body2">₹72,000</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Expenses:
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    ₹50,400
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Savings:
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    ₹21,600
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ReportsWithCharts;
