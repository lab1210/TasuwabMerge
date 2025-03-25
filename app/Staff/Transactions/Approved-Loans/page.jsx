"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/app/Components/Layout";
import dummyLoans from "../../../Components/data/LoanData";
import dummyClient from "../../../Components/data/ClientData";
import { GrTransaction } from "react-icons/gr";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Pagination,
  Box,
  IconButton,
  Tooltip,
  Typography,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import CreateTransactionModal from "../CreateTransactionModal";

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

const ApprovedLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 5;

  useEffect(() => {
    // Fetch loans (replace with your actual data fetching logic)
    setLoans(dummyLoans);
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredLoans = loans.filter((loan) => {
    const loanapplication = loan.LoanApplication;
    const client = dummyClient.find(
      (client) => client.clientId === loanapplication.clientId
    );
    const clientName = client ? client.fullName : "";

    // Include clientName in the search
    return (
      Object.values(loanapplication).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      ) || clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenModal = (loanId) => {
    console.log("Loan ID received in handleOpenModal:", loanId);
    setSelectedLoanId(loanId);
    setModalOpen(true);
    console.log(selectedLoanId);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleTransactionCreate = (transactionData) => {
    try {
      // 1. Find the selected loan in the data
      const selectedLoanIndex = loans.findIndex(
        (loan) => loan.LoanApplication.id === transactionData.loanId
      );

      if (selectedLoanIndex === -1) {
        throw new Error("Loan not found");
      }

      // 2. Update the loan status if the transaction type is Disbursement
      if (transactionData.transactionType === "Disbursement") {
        loans[selectedLoanIndex].LoanApplication.status = "Active";
      }

      // 3. Update the state to trigger re-render
      setLoans([...loans]);

      toast.success("Transaction created successfully!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
      handleCloseModal();
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error("Failed to create transaction. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
      });
    }
  };

  const indexOfLastLoan = currentPage * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = filteredLoans.slice(indexOfFirstLoan, indexOfLastLoan);

  const totalPages = Math.ceil(filteredLoans.length / loansPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box sx={{ padding: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Box>
              <Typography variant="h4" component="h1">
                Approved Loans
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and manage approved loan applications.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              label="Search loans..."
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              size="small"
            />
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S/N</TableCell>
                  <TableCell>Client Name</TableCell>
                  <TableCell>Loan Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentLoans
                  .filter(
                    (loan) =>
                      loan.LoanApplication.status === "Approved" ||
                      loan.LoanApplication.status === "Active"
                  )
                  .map((loan, index) => {
                    const client = dummyClient.find(
                      (client) =>
                        client.clientId === loan.LoanApplication.clientId
                    );
                    const clientName = client
                      ? client.fullName
                      : "Unknown Client";
                    return (
                      <TableRow key={loan.LoanApplication.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{clientName}</TableCell>
                        <TableCell>
                          {loan.LoanApplication.loanRequestAmount}
                        </TableCell>
                        <TableCell>{loan.LoanApplication.status}</TableCell>
                        <TableCell>
                          <Tooltip title="Create Transaction">
                            <IconButton
                              style={{ color: "#333" }}
                              onClick={() => {
                                console.log(
                                  "Loan ID passed to handleOpenModal:",
                                  loan.LoanApplication.id
                                );

                                handleOpenModal(loan.LoanApplication.id);
                              }}
                            >
                              <GrTransaction />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
          <CreateTransactionModal
            open={modalOpen}
            onClose={handleCloseModal}
            loanId={selectedLoanId}
            onTransactionCreate={handleTransactionCreate}
          />
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default ApprovedLoansPage;
