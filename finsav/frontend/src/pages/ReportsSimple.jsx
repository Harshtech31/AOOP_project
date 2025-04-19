import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
} from "@mui/material";

const ReportsSimple = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4">Reports</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          This is a simplified reports page to troubleshoot rendering issues.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ReportsSimple;
