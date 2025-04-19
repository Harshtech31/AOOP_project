import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Button, Grid } from '@mui/material';
import { TrendingUp, Savings, CreditCard, AccountBalance } from '@mui/icons-material';

const SmartAdvisor = () => {
  const recommendations = [
    {
      icon: <Savings />,
      title: 'Savings Optimization',
      description: 'Based on your income and expenses, you could save an additional $500 per month by reducing discretionary spending.',
      action: 'View Savings Plan'
    },
    {
      icon: <CreditCard />,
      title: 'Credit Card Usage',
      description: 'Your credit card utilization is at 45%. Consider paying down balances to improve your credit score.',
      action: 'View Credit Report'
    },
    {
      icon: <AccountBalance />,
      title: 'Investment Opportunities',
      description: 'You have $2,000 available for investment. Consider diversifying your portfolio with index funds.',
      action: 'View Investment Options'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Smart Financial Advisor
      </Typography>
      <Grid container spacing={3}>
        {recommendations.map((rec, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <ListItemIcon sx={{ mb: 2 }}>
                {rec.icon}
              </ListItemIcon>
              <Typography variant="h6" gutterBottom>
                {rec.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {rec.description}
              </Typography>
              <Button variant="contained" color="primary">
                {rec.action}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Financial Health Score
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <Box sx={{ width: '75%', height: 20, bgcolor: 'primary.main', borderRadius: 1 }} />
          </Box>
          <Typography>75/100</Typography>
        </Box>
        <List>
          <ListItem>
            <ListItemText
              primary="Savings Rate"
              secondary="You're saving 15% of your income (Good)"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Debt-to-Income Ratio"
              secondary="Your DTI is 35% (Needs Improvement)"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Emergency Fund"
              secondary="You have 3 months of expenses saved (Good)"
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default SmartAdvisor; 