import React from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent, CardHeader, IconButton } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { MoreVert, TrendingUp, AccountBalance, CalendarMonth, Receipt } from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MotionPaper = motion(Paper);

const Dashboard = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [3000, 3500, 4000, 3800, 4200, 4500],
        borderColor: '#90caf9',
        backgroundColor: 'rgba(144, 202, 249, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Expenses',
        data: [2500, 2800, 3200, 3000, 3500, 3800],
        borderColor: '#f48fb1',
        backgroundColor: 'rgba(244, 143, 177, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#fff'
        }
      }
    }
  };

  const features = [
    {
      title: 'Smart Financial Advisor',
      icon: <TrendingUp />,
      description: 'Get personalized financial advice based on your spending patterns'
    },
    {
      title: 'Bill Splitting',
      icon: <Receipt />,
      description: 'Easily split bills with friends and track shared expenses'
    },
    {
      title: 'Cash Flow Calendar',
      icon: <CalendarMonth />,
      description: 'Visualize your income and expenses on a calendar view'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'primary.main' }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Financial Overview */}
        <Grid item xs={12} md={8}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ p: 2, height: '100%' }}
          >
            <Typography variant="h6" gutterBottom>
              Financial Overview
            </Typography>
            <Line data={data} options={options} />
          </MotionPaper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{ p: 2, height: '100%' }}
          >
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Monthly Income: <Typography component="span" color="primary.main">$4,500</Typography>
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Monthly Expenses: <Typography component="span" color="error.main">$3,800</Typography>
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Savings Rate: <Typography component="span" color="success.main">15%</Typography>
              </Typography>
            </Box>
          </MotionPaper>
        </Grid>

        {/* Features Grid */}
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              sx={{ p: 2, height: '100%' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton color="primary">
                  {feature.icon}
                </IconButton>
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {feature.title}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </MotionPaper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard; 