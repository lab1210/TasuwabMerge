// app/Staff/Loan/Interest/process/page.js
"use client";
import React, { useState } from "react";
import Layout from "@/app/Components/Layout";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import settingsData from "../../../../Components/data/SettingData"; // Import loan products from settings
import loanData from "@/app/Components/data/LoanData"; // Import loan data

const ProcessInterestRates = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loanProduct, setLoanProduct] = useState("");
  const [processedLoans, setProcessedLoans] = useState([]); // State to store processed loans

  const handleProcessInterest = () => {
    const filteredLoans = loanData.filter((loan) => {
      const loanTypeFromData = loan.LoanApplication.loanType;
      const loanTypeFromDataLower = loanTypeFromData.toLowerCase();
      const selectedLoanProductLower = loanProduct.toLowerCase();

      console.log("Loan Type (Data):", loanTypeFromData);
      console.log("Loan Type (Data Lower):", loanTypeFromDataLower);
      console.log("Selected Loan Product (Lower):", selectedLoanProductLower);
      console.log(
        "Comparison Result:",
        loanTypeFromDataLower === selectedLoanProductLower
      );

      return loanTypeFromDataLower === selectedLoanProductLower;
    });
    console.log(loanProduct);
    const calculatedInterest = filteredLoans.map((loan) => {
      const interestRate = 0.05;
      const interestAmount =
        loan.LoanApplication.loanRequestAmount * interestRate;
      return {
        loanId: loan.LoanApplication.id,
        amount: interestAmount,
        startDate,
        endDate,
      };
    });

    setProcessedLoans([...calculatedInterest]); // Create a new array reference
    console.log("Processed Interest:", calculatedInterest);
  };

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

  const selectStyle = {
    "& .MuiOutlinedInput-root":{
      "&:focus-within":{
        "& .MuiOutlinedInput-notchedOutline":{
          borderColor: "rgba(80, 170, 78, 0.5)",
          boxShadow: "0 0 0 0.2rem rgba(80, 170, 78, 0.25)",
        },
      },
    },
    "& label.Mui-focused":{
      color:"#50aa4e"
    }
  };
  return (
    <Layout>
      <Box sx={{ padding: 3 }}>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 8 }}>
          <Typography variant="h4" gutterBottom style={{ color: "#333" }}>
            Process Interest Rates
          </Typography>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyle} // Apply focus style

              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyle} // Apply focus style

              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth sx={selectStyle}>
                <InputLabel id="loan-product-label">Loan Product</InputLabel>
                <Select
                  labelId="loan-product-label"
                  id="loan-product"
                  value={loanProduct}
                  label="Loan Product"
                  onChange={(e) => setLoanProduct(e.target.value)}

                >
                  {settingsData.loanProducts.map((product) => (
                    <MenuItem key={product.name} value={product.name}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleProcessInterest}
                style={{ backgroundColor: "#50aa4e" }}
              >
                Process Interest
              </Button>
            </Grid>
          </Grid>
          {processedLoans.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6">Processed Loans:</Typography>
              <ul>
                {processedLoans.map((loan) => (
                  <li key={loan.loanId}>
                    Loan ID: {loan.loanId}, Interest: {loan.amount}
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

export default ProcessInterestRates;
