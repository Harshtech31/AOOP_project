import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";

const Reports = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4">Reports</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading reports functionality...
        </Typography>
      </Paper>
    </Container>
  );
};

export default Reports;
