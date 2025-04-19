import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Assessment,
} from "@mui/icons-material";

const ReportsWithTabsOnly = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
          <Typography variant="body1">
            This report will show your income compared to your expenses over time.
          </Typography>
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

export default ReportsWithTabsOnly;
