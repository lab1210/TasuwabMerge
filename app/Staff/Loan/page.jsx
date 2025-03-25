"use client";
import React, { useState } from "react";
import Layout from "@/app/Components/Layout";
import loanData from "../../Components/data/LoanData";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Pagination,
} from "@mui/material";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditLoan from "./EditLoan";
import DeleteLoan from "./DeleteLoan";

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

const LoanList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 5;
  const [editLoanId, setEditLoanId] = useState(null);
  const [deleteLoan, setDeleteLoan] = useState(null);
  const [loans, setLoans] = useState(loanData);
  const router = useRouter(); // Initialize useRouter

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditClick = (loanId) => {
    setEditLoanId(loanId);
  };

  const handleCloseEditModal = () => {
    setEditLoanId(null);
  };

  const handleDeleteClick = (loan) => {
    setDeleteLoan(loan);
  };

  const handleCloseDeleteModal = () => {
    setDeleteLoan(null);
  };

  const handleLoanDelete = (loanId) => {
    const updatedLoans = loans.filter(
      (loan) => loan.LoanApplication.id !== loanId
    );
    setLoans(updatedLoans);
    setDeleteLoan(null);
  };

  const handleLoanUpdate = (updatedLoans) => {
    setLoans(updatedLoans);
  };

  const handleViewDetails = (loanId) => {
    //Handle View Details
    router.push(`/Staff/Loan/${loanId}`); // Navigate to loan details page
  };

  const indexOfLastLoan = currentPage * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = loans.slice(indexOfFirstLoan, indexOfLastLoan);

  const totalPages = Math.ceil(loans.length / loansPerPage);

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
            <Typography variant="h4" component="h1">
              Loan Applications
            </Typography>
            <Tooltip title="Add Loan Application">
              <IconButton
                style={{ color: "#50aa4e" }}
                onClick={() => router.push("/Staff/Loan/Loan-Application")}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary">
            View and manage all loan applications.
          </Typography>

          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Loan ID</TableCell>
                  <TableCell>Client ID</TableCell>
                  <TableCell>Loan Amount</TableCell>
                  <TableCell>Loan Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentLoans.map((loan) => (
                  <TableRow key={loan.LoanApplication.id}>
                    <TableCell>{loan.LoanApplication.id}</TableCell>
                    <TableCell>{loan.LoanApplication.clientId}</TableCell>
                    <TableCell>
                      {loan.LoanApplication.loanRequestAmount}
                    </TableCell>
                    <TableCell>{loan.LoanApplication.loanType}</TableCell>
                    <TableCell>{loan.LoanApplication.status}</TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          style={{ color: "#333" }}
                          onClick={() =>
                            handleViewDetails(loan.LoanApplication.id)
                          }
                        >
                          <FaEye />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit/Approve Loan">
                        <IconButton
                          style={{ color: "#333" }}
                          onClick={() =>
                            handleEditClick(loan.LoanApplication.id)
                          }
                        >
                          <FaEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Loan">
                        <IconButton
                          style={{ color: "red" }}
                          onClick={() => handleDeleteClick(loan)}
                        >
                          <FaTrash />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
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
        </Box>
        {editLoanId && (
          <EditLoan
            loanId={editLoanId}
            onClose={handleCloseEditModal}
            onUpdate={handleLoanUpdate}
            loans={loans}
          />
        )}
        {deleteLoan && (
          <DeleteLoan
            loan={deleteLoan}
            isOpen={!!deleteLoan}
            onClose={handleCloseDeleteModal}
            onDelete={handleLoanDelete}
          />
        )}
      </Layout>
    </ThemeProvider>
  );
};

export default LoanList;
