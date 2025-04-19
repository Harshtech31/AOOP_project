import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Assessment,
} from "@mui/icons-material";

const ReportsFixed = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [periodView, setPeriodView] = useState('all');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePeriodViewChange = (event) => {
    setPeriodView(event.target.value);
  };

  // Sample data for charts
  const monthlyData = [
    { month: "Jan", income: 5000, expense: 3800, savings: 1200 },
    { month: "Feb", income: 5200, expense: 4200, savings: 1000 },
    { month: "Mar", income: 5500, expense: 3900, savings: 1600 },
    { month: "Apr", income: 5300, expense: 4100, savings: 1200 },
    { month: "May", income: 5800, expense: 4300, savings: 1500 },
    { month: "Jun", income: 6000, expense: 4000, savings: 2000 },
  ];

  const categoryData = [
    { category: "Housing", amount: 1500, color: theme.palette.primary.main },
    { category: "Food", amount: 800, color: theme.palette.secondary.main },
    {
      category: "Transportation",
      amount: 600,
      color: theme.palette.success.main,
    },
    { category: "Entertainment", amount: 400, color: theme.palette.error.main },
    { category: "Utilities", amount: 500, color: theme.palette.warning.main },
    { category: "Others", amount: 300, color: theme.palette.info.main },
  ];

  // Calculate max values for scaling
  const maxIncome = Math.max(...monthlyData.map((item) => item.income));
  const maxExpense = Math.max(...monthlyData.map((item) => item.expense));
  const maxSavings = Math.max(...monthlyData.map((item) => item.savings));
  const maxValue = Math.max(maxIncome, maxExpense, maxSavings);

  const totalCategoryAmount = categoryData.reduce(
    (sum, item) => sum + item.amount,
    0
  );

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
          
          {/* Simple CSS-based bar chart */}
          <Box sx={{ mt: 4, mb: 4, height: 300, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
            {monthlyData.map((item) => (
              <Box key={item.month} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', height: 250 }}>
                  <Box 
                    sx={{ 
                      width: '60%', 
                      height: `${(item.income / maxValue) * 100}%`, 
                      bgcolor: theme.palette.success.main,
                      mb: 0.5
                    }} 
                  />
                  <Box 
                    sx={{ 
                      width: '60%', 
                      height: `${(item.expense / maxValue) * 100}%`, 
                      bgcolor: theme.palette.error.main,
                      mb: 0.5
                    }} 
                  />
                  <Box 
                    sx={{ 
                      width: '60%', 
                      height: `${(item.savings / maxValue) * 100}%`, 
                      bgcolor: theme.palette.info.main
                    }} 
                  />
                </Box>
                <Typography variant="body2">{item.month}</Typography>
              </Box>
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.success.main, mr: 1 }} />
              <Typography variant="body2">Income</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.error.main, mr: 1 }} />
              <Typography variant="body2">Expenses</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.info.main, mr: 1 }} />
              <Typography variant="body2">Savings</Typography>
            </Box>
          </Box>
          
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Income Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Total Income:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ₹{monthlyData.reduce((sum, item) => sum + item.income, 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Monthly Average:</Typography>
                  <Typography variant="body1">
                    ₹{Math.round(monthlyData.reduce((sum, item) => sum + item.income, 0) / monthlyData.length).toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Expense Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Total Expenses:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="error.main">
                    ₹{monthlyData.reduce((sum, item) => sum + item.expense, 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Monthly Average:</Typography>
                  <Typography variant="body1">
                    ₹{Math.round(monthlyData.reduce((sum, item) => sum + item.expense, 0) / monthlyData.length).toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Savings Summary
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Total Savings:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    ₹{monthlyData.reduce((sum, item) => sum + item.savings, 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Monthly Average:</Typography>
                  <Typography variant="body1">
                    ₹{Math.round(monthlyData.reduce((sum, item) => sum + item.savings, 0) / monthlyData.length).toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Spending by Category Report
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {/* Simple CSS-based pie chart representation */}
              <Box sx={{ position: 'relative', width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 200, 
                  height: 200, 
                  borderRadius: '50%', 
                  background: `conic-gradient(
                    ${categoryData.map((item, index, arr) => {
                      const startPercent = arr.slice(0, index).reduce((sum, i) => sum + i.amount, 0) / totalCategoryAmount * 100;
                      const endPercent = startPercent + (item.amount / totalCategoryAmount * 100);
                      return `${item.color} ${startPercent}% ${endPercent}%`;
                    }).join(', ')}
                  )`
                }} />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Category Breakdown
              </Typography>
              {categoryData.map((item) => (
                <Box key={item.category} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: item.color, mr: 1 }} />
                      <Typography variant="body2">{item.category}</Typography>
                    </Box>
                    <Typography variant="body2">
                      ₹{item.amount.toLocaleString()} ({Math.round(item.amount / totalCategoryAmount * 100)}%)
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 8, bgcolor: 'grey.200', borderRadius: 1 }}>
                    <Box 
                      sx={{ 
                        width: `${(item.amount / totalCategoryAmount) * 100}%`, 
                        height: '100%', 
                        bgcolor: item.color,
                        borderRadius: 1
                      }} 
                    />
                  </Box>
                </Box>
              ))}
            </Grid>
          </Grid>
        </Paper>
      )}

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Savings Analysis Report
          </Typography>
          
          <Box sx={{ mt: 3, mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Monthly Savings Trend</Typography>
            <Box sx={{ mt: 2, height: 200, display: 'flex', alignItems: 'flex-end', gap: 2 }}>
              {monthlyData.map((item) => (
                <Box key={item.month} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <Box 
                    sx={{ 
                      width: '60%', 
                      height: `${(item.savings / maxSavings) * 100}%`, 
                      bgcolor: theme.palette.success.main,
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4
                    }} 
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>{item.month}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Savings Overview
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Total Savings:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    ₹{monthlyData.reduce((sum, item) => sum + item.savings, 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Savings Rate:</Typography>
                  <Typography variant="body1">
                    {Math.round(monthlyData.reduce((sum, item) => sum + item.savings, 0) / 
                      monthlyData.reduce((sum, item) => sum + item.income, 0) * 100)}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Monthly Average:</Typography>
                  <Typography variant="body1">
                    ₹{Math.round(monthlyData.reduce((sum, item) => sum + item.savings, 0) / monthlyData.length).toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Savings Potential
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Current Monthly:</Typography>
                  <Typography variant="body1">
                    ₹{Math.round(monthlyData.reduce((sum, item) => sum + item.savings, 0) / monthlyData.length).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Potential Monthly:</Typography>
                  <Typography variant="body1" color="success.main">
                    ₹{Math.round(monthlyData.reduce((sum, item) => sum + item.savings, 0) / monthlyData.length * 1.5).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Annual Impact:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    ₹{Math.round(monthlyData.reduce((sum, item) => sum + item.savings, 0) / monthlyData.length * 1.5 * 12 - 
                      monthlyData.reduce((sum, item) => sum + item.savings, 0) / monthlyData.length * 12).toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Financial Period Summary
          </Typography>
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
          {(periodView === 'all' || periodView === 'daily') && (
            <Grid item xs={12} sm={periodView === 'all' ? 6 : 12} md={periodView === 'all' ? 3 : 6} lg={periodView === 'all' ? 3 : 6}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: "background.default" }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Daily Average
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Income:</Typography>
                  <Typography variant="body2">₹200</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Expenses:</Typography>
                  <Typography variant="body2" color="error.main">₹140</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Savings:</Typography>
                  <Typography variant="body2" color="success.main">₹60</Typography>
                </Box>
              </Paper>
            </Grid>
          )}
          
          {(periodView === 'all' || periodView === 'monthly') && (
            <Grid item xs={12} sm={periodView === 'all' ? 6 : 12} md={periodView === 'all' ? 3 : 6} lg={periodView === 'all' ? 3 : 6}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: "background.default" }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Monthly Summary
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Income:</Typography>
                  <Typography variant="body2">₹6,000</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Expenses:</Typography>
                  <Typography variant="body2" color="error.main">₹4,200</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Savings:</Typography>
                  <Typography variant="body2" color="success.main">₹1,800</Typography>
                </Box>
              </Paper>
            </Grid>
          )}
          
          {(periodView === 'all' || periodView === 'quarterly') && (
            <Grid item xs={12} sm={periodView === 'all' ? 6 : 12} md={periodView === 'all' ? 3 : 6} lg={periodView === 'all' ? 3 : 6}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: "background.default" }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Quarterly Results
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Income:</Typography>
                  <Typography variant="body2">₹18,000</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Expenses:</Typography>
                  <Typography variant="body2" color="error.main">₹12,600</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Savings:</Typography>
                  <Typography variant="body2" color="success.main">₹5,400</Typography>
                </Box>
              </Paper>
            </Grid>
          )}
          
          {(periodView === 'all' || periodView === 'yearly') && (
            <Grid item xs={12} sm={periodView === 'all' ? 6 : 12} md={periodView === 'all' ? 3 : 6} lg={periodView === 'all' ? 3 : 6}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: "background.default" }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Financial Year
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Income:</Typography>
                  <Typography variant="body2">₹72,000</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">Expenses:</Typography>
                  <Typography variant="body2" color="error.main">₹50,400</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Savings:</Typography>
                  <Typography variant="body2" color="success.main">₹21,600</Typography>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ReportsFixed;
