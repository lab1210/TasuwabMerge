"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StaffModal from "@/app/Components/StaffModal";
import styles from "../../Components/css/StaffModal.module.css";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Grid,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const theme = createTheme({
  palette: {
    primary: {
      main: "#50aa4e",
    },
    text: {
      primary: "#333",
    },
  },
});

const EditLoan = ({ loanId, onClose, loans, onUpdate }) => {
  const router = useRouter();
  const [loan, setLoan] = useState(null);
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const foundLoan = loans.find((loan) => loan.LoanApplication.id === loanId);
    setLoan(foundLoan);
    setFormData(foundLoan?.LoanApplication || null);
  }, [loanId, loans]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let documentUrl = formData.documentUrl;

    if (file) {
      try {
        const uploadedUrl = await uploadFile(file);
        documentUrl = uploadedUrl;
      } catch (error) {
        setMessage("Error uploading document.");
        return;
      }
    }

    const updatedFormData = { ...formData, documentUrl };

    const updatedLoans = loans.map((loan) => {
      if (loan.LoanApplication.id === loanId) {
        return { LoanApplication: updatedFormData };
      } else {
        return loan;
      }
    });

    onUpdate(updatedLoans);

    setMessage("Loan updated successfully!");
    setTimeout(() => {
      setMessage("");
      onClose();
    }, 2000);
  };

  const uploadFile = async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`/uploads/${file.name}`);
      }, 1000);
    });
  };

  if (!formData) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ padding: 3 }}>
          <Typography variant="h6">Loading...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  const inputFields = [
    { label: "Loan Request Amount", name: "loanRequestAmount", type: "number" },
    { label: "Purpose of Loan", name: "purposeOfLoan", type: "text" },
    { label: "Bank", name: "bank", type: "text" },
    { label: "Bank Account", name: "bankAccount", type: "text" },
    { label: "Guarantor 1 Name", name: "guarantor1Name", type: "text" },
    { label: "Guarantor 1 Address", name: "guarantor1Address", type: "text" },
    { label: "Guarantor 1 Phone", name: "guarantor1Phone", type: "text" },
    { label: "Guarantor 1 Email", name: "guarantor1Email", type: "email" },
    { label: "Guarantor 2 Name", name: "guarantor2Name", type: "text" },
    { label: "Guarantor 2 Address", name: "guarantor2Address", type: "text" },
    { label: "Guarantor 2 Phone", name: "guarantor2Phone", type: "text" },
    { label: "Guarantor 2 Email", name: "guarantor2Email", type: "email" },
    { label: "Memo", name: "memo", type: "text" },
  ];

  const selectFields = [
    {
      label: "Loan Type",
      name: "loanType",
      options: ["Personal", "Mortgage", "Business"],
    },
    {
      label: "Interest Type",
      name: "interestType",
      options: ["Fixed", "Variable"],
    },
    {
      label: "Status",
      name: "status",
      options: ["Pending", "Approved", "Rejected", "Active"],
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <StaffModal isOpen={true} onClose={onClose} title="Edit Loan Application">
        <form onSubmit={handleSubmit}>
          {message && <p className={styles.successMessage}>{message}</p>}
          <Grid container spacing={2}>
            {inputFields.map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <TextField
                  label={field.label}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            ))}

            {selectFields.map((field, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <FormControl fullWidth>
                  <InputLabel id={`${field.name}-select-label`}>
                    {field.label}
                  </InputLabel>
                  <Select
                    labelId={`${field.name}-select-label`}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    label={field.label}
                  >
                    {field.options.map((option) => (
                      <MenuItem
                        key={option}
                        value={option}
                        disabled={option === "Active"}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}

            {/* Document Upload Field (Last Field) */}
            <Grid item xs={12}>
              <Paper
                elevation={1}
                sx={{
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                  border: "1px dashed #ccc",
                }}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  id="file-upload-input"
                  style={{ display: "none" }}
                />
                <label htmlFor="file-upload-input">
                  <IconButton component="span" color="primary">
                    <CloudUploadIcon />
                  </IconButton>
                </label>
                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                  {file ? file.name : "Upload Document"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#50aa4e", color: "white" }}
            >
              Save Changes
            </Button>
            <Button style={{ color: "#333" }} onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </StaffModal>
    </ThemeProvider>
  );
};

export default EditLoan;
