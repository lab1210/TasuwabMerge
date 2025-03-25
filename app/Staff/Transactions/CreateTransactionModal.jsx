"use client";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import settingsData from "../../Components/data/SettingData";
import dummyLoans from "../../Components/data/LoanData";

const CreateTransactionModal = ({
  open,
  onClose,
  loanId,
  onTransactionCreate,
}) => {
  const [formData, setFormData] = useState({
    loanId: loanId,
    transactionType: "",
    amount: 0,
    notes: "",
  });

  const [loans, setLoans] = useState([]);
  const [filteredTransactionTypes, setFilteredTransactionTypes] = useState([]);

  useEffect(() => {
    setLoans(dummyLoans);
  });

  useEffect(() => {
    console.log("loanId:", loanId);
    console.log("loans:", loans);
    if (loanId && loans.length > 0) {
      const selectedLoan = loans.find(
        (loan) => loan.LoanApplication.id === loanId
      );
      console.log("selectedLoan:", selectedLoan);
      if (selectedLoan) {
        const availableTypes = settingsData.transactionTypes.filter((type) => {
          if (selectedLoan.LoanApplication.status === "Approved") {
            return type.name === "Disbursement";
          } else if (selectedLoan.LoanApplication.status === "Active") {
            return (
              type.name === "Payment" ||
              type.name === "Penalty" ||
              type.name === "Interest"
            );
          }
          return false;
        });

        console.log("availableTypes:", availableTypes);
        setFilteredTransactionTypes(availableTypes);
      }
    } else {
      setFilteredTransactionTypes([]);
    }
    console.log("filteredTransactionTypes:", filteredTransactionTypes);
  }, [loanId, loans]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Simulate transaction creation (replace with your actual logic)
      console.log("Transaction created:", formData);
      onTransactionCreate(formData);
      onClose();
    } catch (error) {
      console.error("Error creating transaction:", error);
      // Handle errors (e.g., display error message)
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Create Transaction
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="transaction-type-select-label">
                  Transaction Type
                </InputLabel>
                <Select
                  labelId="transaction-type-select-label"
                  name="transactionType"
                  value={formData.transactionType}
                  onChange={handleChange}
                  label="Transaction Type"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {Array.isArray(filteredTransactionTypes) &&
                    filteredTransactionTypes.map((type) => (
                      <MenuItem key={type.name} value={type.name}>
                        {type.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                fullWidth
                type="number"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                fullWidth
                multiline
              />
            </Grid>
          </Grid>

          <div style={{ marginTop: "20px" }}>
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#50aa4e" }}
            >
              Create Transaction
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateTransactionModal;
