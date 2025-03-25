// app/settings/page.js
"use client";
import React, { useState } from "react";
import Layout from "@/app/Components/Layout";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";

import settingsData from "../../../Components/data/SettingData"; // Import all dummy data from settingsData.js

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Layout>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          System Settings
        </Typography>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            "& .Mui-selected": {
              color: "#50aa4e !important", // Sets the active tab text color
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#50aa4e", // Sets the underline color to a custom color
            },
          }}
        >
          <Tab label="Transaction Types" />
          <Tab label="Interest Types" />
          <Tab label="Interest Table" />
          <Tab label="Default Charges" />
          <Tab label="Loan Products" />
        </Tabs>
        <Box sx={{ padding: 2 }}>
          {activeTab === 0 && <TransactionTypesSettings />}
          {activeTab === 1 && <InterestTypesSettings />}
          {activeTab === 2 && <InterestTableSettings />}
          {activeTab === 3 && <DefaultChargesSettings />}
          {activeTab === 4 && <LoanProductsSettings />}
        </Box>
      </Box>
    </Layout>
  );
};

const TransactionTypesSettings = () => {
  const [transactionTypes, setTransactionTypes] = useState(
    settingsData.transactionTypes
  );

  const handleAddTransactionType = () => {
    setTransactionTypes([...transactionTypes, { name: "", description: "" }]);
  };

  const handleTransactionTypeChange = (index, field, value) => {
    const updatedTypes = [...transactionTypes];
    updatedTypes[index][field] = value;
    setTransactionTypes(updatedTypes);
  };

  return (
    <Box>
      <Typography variant="h6">Transaction Types Configuration</Typography>
      {transactionTypes.map((type, index) => (
        <Grid container spacing={3} key={index} sx={{ marginBottom: 2 }}>
          <Grid item xs={4}>
            <TextField
              label="Name"
              value={type.name}
              onChange={(e) =>
                handleTransactionTypeChange(index, "name", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Description"
              value={type.description}
              onChange={(e) =>
                handleTransactionTypeChange(
                  index,
                  "description",
                  e.target.value
                )
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id={`sign-label-${index}`}>Sign</InputLabel>
              <Select
                labelId={`sign-label-${index}`}
                id={`sign-${index}`}
                value={type.sign}
                label="Sign"
                onChange={(e) =>
                  handleTransactionTypeChange(index, "sign", e.target.value)
                }
              >
                <MenuItem value="+">+</MenuItem>
                <MenuItem value="-">-</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ))}
      <Button
        variant="contained"
        style={{ backgroundColor: "#333" }}
        onClick={handleAddTransactionType}
      >
        Add Transaction Type
      </Button>
    </Box>
  );
};

const InterestTypesSettings = () => {
  const [interestTypes, setInterestTypes] = useState(
    settingsData.interestTypes
  );

  const handleAddInterestType = () => {
    setInterestTypes([...interestTypes, { name: "", formula: "" }]);
  };

  const handleInterestTypeChange = (index, field, value) => {
    const updatedTypes = [...interestTypes];
    updatedTypes[index][field] = value;
    setInterestTypes(updatedTypes);
  };

  return (
    <Box>
      <Typography variant="h6">Interest Types Configuration</Typography>
      {interestTypes.map((type, index) => (
        <Grid container spacing={2} key={index} sx={{ marginBottom: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              value={type.name}
              onChange={(e) =>
                handleInterestTypeChange(index, "name", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Formula"
              value={type.formula}
              onChange={(e) =>
                handleInterestTypeChange(index, "formula", e.target.value)
              }
              fullWidth
            />
          </Grid>
        </Grid>
      ))}
      <Button
        variant="contained"
        style={{ backgroundColor: "#333" }}
        onClick={handleAddInterestType}
      >
        Add Interest Type
      </Button>
    </Box>
  );
};

const InterestTableSettings = () => {
  const [interestRates, setInterestRates] = useState(
    settingsData.interestTable
  );

  const handleAddInterestRate = () => {
    setInterestRates([
      ...interestRates,
      { minAmount: 0, maxAmount: 0, rate: 0 },
    ]);
  };

  const handleInterestRateChange = (index, field, value) => {
    const updatedRates = [...interestRates];
    updatedRates[index][field] = value;
    setInterestRates(updatedRates);
  };

  return (
    <Box>
      <Typography variant="h6">Interest Table Configuration</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Min Amount</TableCell>
              <TableCell>Max Amount</TableCell>
              <TableCell>Rate (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interestRates.map((rate, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    type="number"
                    value={rate.minAmount}
                    onChange={(e) =>
                      handleInterestRateChange(
                        index,
                        "minAmount",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={rate.maxAmount}
                    onChange={(e) =>
                      handleInterestRateChange(
                        index,
                        "maxAmount",
                        e.target.value
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={rate.rate}
                    onChange={(e) =>
                      handleInterestRateChange(index, "rate", e.target.value)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        onClick={handleAddInterestRate}
        style={{ backgroundColor: "#333" }}
        sx={{ marginTop: 2 }}
      >
        Add Rate
      </Button>
    </Box>
  );
};

const DefaultChargesSettings = () => {
  const [defaultCharges, setDefaultCharges] = useState(
    settingsData.defaultCharges
  );

  const handleAddDefaultCharge = () => {
    setDefaultCharges([...defaultCharges, { name: "", amount: 0 }]);
  };

  const handleDefaultChargeChange = (index, field, value) => {
    const updatedCharges = [...defaultCharges];
    updatedCharges[index][field] = value;
    setDefaultCharges(updatedCharges);
  };

  return (
    <Box>
      <Typography variant="h6">
        Default Charges & Penalties Configuration
      </Typography>
      {defaultCharges.map((charge, index) => (
        <Grid container spacing={2} key={index} sx={{ marginBottom: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              value={charge.name}
              onChange={(e) =>
                handleDefaultChargeChange(index, "name", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="number"
              label="Amount"
              value={charge.amount}
              onChange={(e) =>
                handleDefaultChargeChange(index, "amount", e.target.value)
              }
              fullWidth
            />
          </Grid>
        </Grid>
      ))}
      <Button
        variant="contained"
        style={{ backgroundColor: "#333" }}
        onClick={handleAddDefaultCharge}
      >
        Add Charge
      </Button>
    </Box>
  );
};

const LoanProductsSettings = () => {
  const [loanProducts, setLoanProducts] = useState(settingsData.loanProducts);

  const handleAddLoanProduct = () => {
    setLoanProducts([...loanProducts, { name: "", terms: "" }]);
  };

  const handleLoanProductChange = (index, field, value) => {
    const updatedProducts = [...loanProducts];
    updatedProducts[index][field] = value;
    setLoanProducts(updatedProducts);
  };

  return (
    <Box>
      <Typography variant="h6">Loan Products Configuration</Typography>
      {loanProducts.map((product, index) => (
        <Grid container spacing={2} key={index} sx={{ marginBottom: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              value={product.name}
              onChange={(e) =>
                handleLoanProductChange(index, "name", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Terms"
              value={product.terms}
              onChange={(e) =>
                handleLoanProductChange(index, "terms", e.target.value)
              }
              fullWidth
            />
          </Grid>
        </Grid>
      ))}
      <Button
        variant="contained"
        style={{ backgroundColor: "#333" }}
        onClick={handleAddLoanProduct}
      >
        Add Loan Product
      </Button>
    </Box>
  );
};

export default SettingsPage;
