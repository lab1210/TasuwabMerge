"use client";
import React, { useState, useRef, useEffect } from "react";
import Layout from "@/app/Components/Layout";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
} from "@mui/material";
import loanData from "@/app/Components/data/LoanData";
import clientdata from "../../../Components/data/ClientData";

const ClientLoanEnquiry = () => {
  const [clientId, setClientId] = useState("");
  const [loanDetails, setLoanDetails] = useState(null);
  const [showClientIdList, setShowClientIdList] = useState(false);
  const inputRef = useRef(null);

  const uniqueClientIds = [
    ...new Set(loanData.map((loan) => loan.LoanApplication.clientId)),
  ];

  const handleLoanEnquiry = () => {
    const clientLoans = loanData.filter(
      (loan) => loan.LoanApplication.clientId === parseInt(clientId)
    );
    const clientInfo = clientdata.find(
      (client) => client.clientId === parseInt(clientId)
    );

    if (clientLoans.length === 0 || !clientInfo) {
      alert("Client ID not found or no loans found for this client.");
      setLoanDetails(null);
      return;
    }

    const loan = clientLoans[0].LoanApplication;

    setLoanDetails({
      clientName: clientInfo.fullName,
      loanId: loan.id,
      loanAmount: loan.loanRequestAmount,
      loanType: loan.loanType,
      interestType: loan.interestType,
      status: loan.status,
      purposeOfLoan: loan.purposeOfLoan,
      bank: loan.bank,
      bankAccount: loan.bankAccount,
      guarantor1Name: loan.guarantor1Name,
      guarantor2Name: loan.guarantor2Name,
      memo: loan.memo,
    });
  };

  const handleClientIdClick = () => {
    setShowClientIdList(true);
  };

  const handleClientIdItemClick = (id) => {
    setClientId(id.toString());
    setShowClientIdList(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowClientIdList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef]);

  return (
    <Layout>
      <Box sx={{ padding: 3 }}>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 8 }}>
          <Typography variant="h4" gutterBottom style={{ color: "#333" }}>
            Client Loan Enquiry
          </Typography>
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12} sm={6}>
              <div ref={inputRef}>
                <TextField
                  label="Client ID"
                  type="number"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  fullWidth
                  onClick={handleClientIdClick}
                  inputProps={{
                    style: {
                      "&:focus": {
                        outline: "none",
                      },
                    },
                  }}
                />
                {showClientIdList && (
                  <List
                    sx={{
                      position: "absolute",
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      zIndex: 1000,
                      width: "100%",
                    }}
                  >
                    {uniqueClientIds.map((id) => (
                      <ListItem
                        button
                        key={id}
                        onClick={() => handleClientIdItemClick(id)}
                      >
                        {id}
                      </ListItem>
                    ))}
                  </List>
                )}
              </div>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleLoanEnquiry}
                style={{ backgroundColor: "#50aa4e" }}
              >
                Get Loan Details
              </Button>
            </Grid>
          </Grid>
          {loanDetails && (
            <Box mt={3}>
              <Typography variant="h6">Loan Details:</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography>Client Name: {loanDetails.clientName}</Typography>
                  <Typography>Loan ID: {loanDetails.loanId}</Typography>
                  <Typography>Loan Amount: {loanDetails.loanAmount}</Typography>
                  <Typography>Loan Type: {loanDetails.loanType}</Typography>
                  <Typography>
                    Interest Type: {loanDetails.interestType}
                  </Typography>
                  <Typography>Status: {loanDetails.status}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>Purpose: {loanDetails.purposeOfLoan}</Typography>
                  <Typography>Bank: {loanDetails.bank}</Typography>
                  <Typography>
                    Bank Account: {loanDetails.bankAccount}
                  </Typography>
                  <Typography>
                    Guarantor 1: {loanDetails.guarantor1Name}
                  </Typography>
                  <Typography>
                    Guarantor 2: {loanDetails.guarantor2Name}
                  </Typography>
                  <Typography>Memo: {loanDetails.memo}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default ClientLoanEnquiry;
