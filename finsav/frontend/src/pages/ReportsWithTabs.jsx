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

const ReportsWithTabs = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
    </Container>
  );
};

export default ReportsWithTabs;
