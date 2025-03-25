// app/Staff/Enquiries/statement/page.js
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
import clientdata from "../../../Components/data/ClientData"; // Import client data
import jsPDF from "jspdf";

const ClientStatement = () => {
  const [clientId, setClientId] = useState("");
  const [statementData, setStatementData] = useState(null); // Changed to single object
  const [showClientIdList, setShowClientIdList] = useState(false);
  const inputRef = useRef(null);

  const uniqueClientIds = [
    ...new Set(loanData.map((loan) => loan.LoanApplication.clientId)),
  ];

  const handleGenerateStatement = () => {
    const clientLoans = loanData.filter(
      (loan) => loan.LoanApplication.clientId === parseInt(clientId)
    );
    const clientInfo = clientdata.find(
      (client) => client.clientId === parseInt(clientId)
    );

    if (clientLoans.length === 0 || !clientInfo) {
      alert("Client ID not found or no loans found for this client.");
      setStatementData(null);
      return;
    }

    const loan = clientLoans[0].LoanApplication; // Access LoanApplication directly
    const paymentHistory = [
      // Dummy payment history. Replace with actual data
      { date: "2023-11-01", amount: 1000 },
      { date: "2023-12-01", amount: 1000 },
    ];
    const currentBalance =
      loan.loanRequestAmount -
      paymentHistory.reduce((acc, payment) => acc + payment.amount, 0);

    const statement = {
      clientName: clientInfo.fullName,
      clientPhone: clientInfo.phoneNumber,
      clientEmail: clientInfo.emailAddress,
      loanId: loan.id,
      loanAmount: loan.loanRequestAmount,
      status: loan.status,
      interestType: loan.interestType,
      interestRate: "5%", // Dummy interest rate
      purposeOfLoan: loan.purposeOfLoan,
      bank: loan.bank,
      bankAccount: loan.bankAccount,
      guarantor1Name: loan.guarantor1Name,
      guarantor2Name: loan.guarantor2Name,
      disbursementDate: "2023-10-15", // Dummy disbursement date
      maturityDate: "2024-10-15", // Dummy maturity date
      currentBalance: currentBalance,
      paymentHistory: paymentHistory,
      nextPaymentDate: "2024-01-01", // Dummy next payment date
      nextPaymentAmount: 1000, // Dummy next payment amount
    };

    setStatementData(statement);
    console.log("Statement Data:", statement);
  };

  const handleDownloadPDF = () => {
    if (!statementData) {
      alert("Generate a statement first.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Client Statement of Account", 10, 10);

    let y = 30;
    doc.text(`Client Name: ${statementData.clientName}`, 10, y);
    doc.text(`Client Phone: ${statementData.clientPhone}`, 10, y + 10);
    doc.text(`Client Email: ${statementData.clientEmail}`, 10, y + 20);
    doc.text(`Loan ID: ${statementData.loanId}`, 10, y + 40);
    doc.text(`Loan Amount: ${statementData.loanAmount}`, 10, y + 50);
    doc.text(`Status: ${statementData.status}`, 10, y + 60);
    doc.text(`Interest Type: ${statementData.interestType}`, 10, y + 70);
    doc.text(`Interest Rate: ${statementData.interestRate}`, 10, y + 80);
    doc.text(`Purpose: ${statementData.purposeOfLoan}`, 10, y + 90);
    doc.text(`Bank: ${statementData.bank}`, 10, y + 100);
    doc.text(`Bank Account: ${statementData.bankAccount}`, 10, y + 110);
    doc.text(`Guarantor 1: ${statementData.guarantor1Name}`, 10, y + 120);
    doc.text(`Guarantor 2: ${statementData.guarantor2Name}`, 10, y + 130);
    doc.text(
      `Disbursement Date: ${statementData.disbursementDate}`,
      10,
      y + 140
    );
    doc.text(`Maturity Date: ${statementData.maturityDate}`, 10, y + 150);
    doc.text(`Current Balance: ${statementData.currentBalance}`, 10, y + 160);
    doc.text(
      `Next Payment Date: ${statementData.nextPaymentDate}`,
      10,
      y + 170
    );
    doc.text(
      `Next Payment Amount: ${statementData.nextPaymentAmount}`,
      10,
      y + 180
    );

    y += 190;
    doc.text("Payment History:", 10, y);
    y += 10;
    statementData.paymentHistory.forEach((payment) => {
      doc.text(`Date: ${payment.date}, Amount: ${payment.amount}`, 20, y);
      y += 10;
    });

    doc.save(`statement_${statementData.clientName}.pdf`);
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
            Client Statement of Account
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
                  sx={textFieldStyle} // Apply focus style

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
                onClick={handleGenerateStatement}
                style={{ backgroundColor: "#50aa4e" }}
              >
                Generate Statement
              </Button>
            </Grid>
            {statementData && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleDownloadPDF}
                  style={{ backgroundColor: "#333" }}
                >
                  Download PDF
                </Button>
              </Grid>
            )}
          </Grid>
          {statementData && (
            <Box mt={3}>
              <Typography variant="h6">Statement Details:</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography>
                    Client Name: {statementData.clientName}
                  </Typography>
                  <Typography>
                    Client Phone: {statementData.clientPhone}
                  </Typography>
                  <Typography>
                    Client Email: {statementData.clientEmail}
                  </Typography>
                  <Typography>Loan ID: {statementData.loanId}</Typography>
                  <Typography>
                    Loan Amount: {statementData.loanAmount}
                  </Typography>
                  <Typography>Status: {statementData.status}</Typography>
                  <Typography>
                    Interest Type: {statementData.interestType}
                  </Typography>
                  <Typography>
                    Interest Rate: {statementData.interestRate}
                  </Typography>
                  <Typography>
                    Purpose: {statementData.purposeOfLoan}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography>Bank: {statementData.bank}</Typography>
                  <Typography>
                    Bank Account: {statementData.bankAccount}
                  </Typography>
                  <Typography>
                    Guarantor 1: {statementData.guarantor1Name}
                  </Typography>
                  <Typography>
                    Guarantor 2: {statementData.guarantor2Name}
                  </Typography>
                  <Typography>
                    Disbursement Date: {statementData.disbursementDate}
                  </Typography>
                  <Typography>
                    Maturity Date: {statementData.maturityDate}
                  </Typography>
                  <Typography>
                    Current Balance: {statementData.currentBalance}
                  </Typography>
                  <Typography>
                    Next Payment Date: {statementData.nextPaymentDate}
                  </Typography>
                  <Typography>
                    Next Payment Amount: {statementData.nextPaymentAmount}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Payment History:</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {statementData.paymentHistory.map((payment, index) => (
                          <TableRow key={index}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>{payment.amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default ClientStatement;
