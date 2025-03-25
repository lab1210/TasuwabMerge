// app/Staff/Loan/defaults/process/page.js
"use client";
import React, { useState } from "react";
import Layout from "@/app/Components/Layout";
import { Box, Typography, Paper, TextField, Button, Grid } from "@mui/material";
import loanData from "@/app/Components/data/LoanData";

const ProcessDefaultCharges = () => {
  const [loanId, setLoanId] = useState("");
  const [defaultDate, setDefaultDate] = useState("");
  const [processedDefaults, setProcessedDefaults] = useState([]);

  const handleProcessDefault = () => {
    const loan = loanData.find(
      (loan) => loan.LoanApplication.id === parseInt(loanId)
    );

    if (!loan) {
      alert("Loan ID not found.");
      return;
    }

    const defaultChargeAmount = loan.LoanApplication.loanRequestAmount * 0.02;

    const defaultCharge = {
      loanId: parseInt(loanId),
      date: defaultDate,
      amount: defaultChargeAmount,
    };

    setProcessedDefaults([...processedDefaults, defaultCharge]);
    console.log("Processed Default Charge:", defaultCharge);
  };

  const filteredLoans = loanData.filter((loan) =>
    loan.LoanApplication.id.toString().includes(loanId)
  );

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      "&:focus-within": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(80, 170, 78, 0.5)", // Light shade of #50aa4e
          boxShadow: "0 0 0 0.2rem rgba(80, 170, 78, 0.25)", // Optional: Add a subtle shadow
        },
      },
    },
  };
  return (
    <Layout>
      <Box sx={{ padding: 3 }}>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 8 }}>
          <Typography variant="h4" gutterBottom style={{ color: "#333" }}>
            Process Default Charges
          </Typography>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Loan ID"
                type="number"
                value={loanId}
                onChange={(e) => setLoanId(e.target.value)}
                fullWidth
                sx={textFieldStyle} // Apply focus style

              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Default Date"
                type="date"
                value={defaultDate}
                onChange={(e) => setDefaultDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyle} // Apply focus style

              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleProcessDefault}
                style={{ backgroundColor: "#50aa4e" }}
              >
                Process Default
              </Button>
            </Grid>
          </Grid>
          {processedDefaults.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6">Processed Defaults:</Typography>
              <ul>
                {processedDefaults.map((defaultCharge, index) => (
                  <li key={index}>
                    Loan ID: {defaultCharge.loanId}, Date: {defaultCharge.date},
                    Amount: {defaultCharge.amount}
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default ProcessDefaultCharges;
