import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
} from "@mui/material";

const ReportsBasic = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Financial Reports
        </Typography>
        <Typography variant="body1">
          This is a basic reports page to troubleshoot rendering issues.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ReportsBasic;
