"use client";
import React, { useEffect, useRef, useState } from "react";
import Layout from "@/app/Components/Layout";
import { useParams } from "next/navigation";
import loanData from "../../../Components/data/LoanData";
import clientData from "../../../Components/data/ClientData";
import transactionData from "../../../Components/data/TransactionData";
import { Document, Page, pdfjs } from "react-pdf";
import {
  Box,
  Typography,
  Divider,
  Paper,
  ListItem,
  ListItemText,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";
import { createTheme, ThemeProvider } from "@mui/material/styles";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

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

const LoanDetails = () => {
  const { loanId } = useParams();
  const [documentContent, setDocumentContent] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const transactionHistoryRef = useRef(null);
  const [transactions, setTransactions] = useState([]); // State for transactions
  const [newTransaction, setNewTransaction] = useState({
    date: "",
    type: "",
    amount: 0,
    description: "",
  });
  const scrollToTransactionHistory = () => {
    if (transactionHistoryRef.current) {
      transactionHistoryRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const [openAddTransaction, setOpenAddTransaction] = useState(false);
  const [editedTransaction, setEditedTransaction] = useState({
    date: "",
    type: "",
    amount: 0,
    description: "",
  });
  const [editTransaction, setEditTransaction] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedAmount, setEditedAmount] = useState("");
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  useEffect(() => {
    if (loan && loan.LoanApplication.documentUrl) {
      const url = loan.LoanApplication.documentUrl;
      const fileType = url.substring(url.lastIndexOf(".") + 1).toLowerCase();

      if (fileType === "pdf") {
        setDocumentContent(url);
      } else if (["jpg", "jpeg", "png", "gif"].includes(fileType)) {
        setDocumentContent(
          <img src={url} alt="Document" style={{ maxWidth: "100%" }} />
        );
      } else if (["txt"].includes(fileType)) {
        fetch(url)
          .then((response) => response.text())
          .then((text) => setDocumentContent(<pre>{text}</pre>))
          .catch((error) => console.error("Error fetching text:", error));
      } else {
        setDocumentContent(
          <Typography variant="body2" color="textSecondary">
            Document type not supported.
          </Typography>
        );
      }
    }
    if (loanId) {
      const loanTransactions = transactionData.filter(
        (transaction) => transaction.loanId === parseInt(loanId, 10)
      );
      setTransactions(loanTransactions);
    }
  }, [loanId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const { loan } = (() => {
    if (!loanId) return {};
    const numericLoanId = parseInt(loanId, 10);
    const foundLoan = loanData.find(
      (l) => l.LoanApplication.id === numericLoanId
    );
    return { loan: foundLoan };
  })();

  const client = loan
    ? clientData.find((c) => c.clientId === loan.LoanApplication.clientId)
    : null;

  if (!loan) {
    return (
      <Layout>
        <Box sx={{ padding: 3 }}>
          <Typography variant="h6">Loan not found.</Typography>
        </Box>
      </Layout>
    );
  }

  const handleAddTransactionClick = () => {
    setOpenAddTransaction(true);
  };

  const handleCloseAddTransaction = () => {
    setOpenAddTransaction(false);
    setNewTransaction({ date: "", type: "", amount: 0, description: "" });
  };

  const handleSaveTransaction = () => {
    const newTransactionToAdd = {
      transactionId: Date.now(), // Generate a unique ID
      loanId: parseInt(loanId, 10),
      ...newTransaction,
    };
    setTransactions([...transactions, newTransactionToAdd]);
    transactionData.push(newTransactionToAdd); // Update the global transaction data
    handleCloseAddTransaction();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTransaction({ ...newTransaction, [name]: value });
  };

  const handleEditTransactionClick = (transaction) => {
    setEditedTransaction({ ...transaction }); // Set all fields for editing
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditTransaction(null);
  };

  const handleSaveEditTransaction = () => {
    if (editTransaction) {
      const index = transactions.findIndex(
        (transaction) =>
          transaction.transactionId === editedTransaction.transactionId
      );
      if (index !== -1) {
        const updatedTransactions = [...transactions];
        updatedTransactions[index] = { ...editedTransaction }; // Update all fields
        setTransactions(updatedTransactions);
        const globalIndex = transactionData.findIndex(
          (transaction) =>
            transaction.transactionId === editedTransaction.transactionId
        );
        if (globalIndex !== -1) {
          transactionData[globalIndex] = { ...editedTransaction };
        }
      }
    }
    handleCloseEditDialog();
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction({ ...editedTransaction, [name]: value });
  };

  const handleDeleteTransactionClick = (transactionId) => {
    setDeleteTransactionId(transactionId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteTransactionId(null);
  };

  const handleConfirmDeleteTransaction = () => {
    if (deleteTransactionId) {
      const updatedTransactions = transactions.filter(
        (transaction) => transaction.transactionId !== deleteTransactionId
      );
      setTransactions(updatedTransactions);
      const globalIndex = transactionData.findIndex(
        (transaction) => transaction.transactionId === deleteTransactionId
      );
      if (globalIndex !== -1) {
        transactionData.splice(globalIndex, 1);
      }
    }
    handleCloseDeleteDialog();
  };

  console.log("documentContent before render:", documentContent);
  const { LoanApplication } = loan;
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Box sx={{ padding: 3 }}>
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 8 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                Loan Application Details
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
              <Typography
                component="a"
                onClick={scrollToTransactionHistory}
                sx={{
                  cursor: "pointer",
                  color: "primary.main",
                  textDecoration: "underline",
                }}
              >
                View Transaction History
              </Typography>
            </Box>
            <Divider sx={{ marginBottom: 3 }} />

            {/* Client Information Section */}
            <Typography
              variant="h6"
              sx={{ marginBottom: 2, fontWeight: "bold" }}
            >
              Client Information
            </Typography>
            <Grid container spacing={2}>
              {client && (
                <>
                  <Grid item xs={12} sm={6}>
                    <ListItem>
                      <ListItemText
                        primary="Full Name"
                        secondary={
                          <Typography color="primary">
                            {client.fullName}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ListItem>
                      <ListItemText
                        primary="Phone Number"
                        secondary={
                          <Typography color="primary">
                            {client.phoneNumber}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <ListItem>
                      <ListItemText
                        primary="Email Address"
                        secondary={
                          <Typography color="primary">
                            {client.emailAddress}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Grid>
                  {/* Add more client information as needed */}
                </>
              )}
            </Grid>
            <Divider sx={{ my: 3 }} />

            {/* Bank Information Section */}
            <Typography
              variant="h6"
              sx={{ marginBottom: 2, fontWeight: "bold" }}
            >
              Bank Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText
                    primary="Bank"
                    secondary={
                      <Typography color="primary">
                        {LoanApplication.bank}
                      </Typography>
                    }
                  />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText
                    primary="Bank Account"
                    secondary={
                      <Typography color="primary">
                        {LoanApplication.bankAccount}
                      </Typography>
                    }
                  />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText
                    primary="Loan Amount"
                    secondary={
                      <Typography color="primary">
                        {LoanApplication.loanRequestAmount}
                      </Typography>
                    }
                  />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText
                    primary="Loan Type"
                    secondary={
                      <Typography color="primary">
                        {LoanApplication.loanType}
                      </Typography>
                    }
                  />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText
                    primary="Interest Type"
                    secondary={
                      <Typography color="primary">
                        {LoanApplication.interestType}
                      </Typography>
                    }
                  />
                </ListItem>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />

            {/* Guarantor Information Section */}
            <Typography
              variant="h6"
              sx={{ marginBottom: 2, fontWeight: "bold" }}
            >
              Guarantor Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText
                    primary="Guarantor 1 Name"
                    secondary={
                      <Typography color="primary">
                        {LoanApplication.guarantor1Name}
                      </Typography>
                    }
                  />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText
                    primary="Guarantor 1 Address"
                    secondary={
                      <Typography color="primary">
                        {LoanApplication.guarantor1Address}
                      </Typography>
                    }
                  />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText
                    primary="Guarantor 2 Name"
                    secondary={
                      <Typography color="primary">
                        {LoanApplication.guarantor2Name}
                      </Typography>
                    }
                  />
                </ListItem>
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText
                    primary="Guarantor 2 Address"
                    secondary={
                      <Typography color="primary">
                        {LoanApplication.guarantor2Address}
                      </Typography>
                    }
                  />
                </ListItem>
              </Grid>
            </Grid>
            <Divider sx={{ my: 3 }} />

            {/* Document Section */}
            <Typography
              variant="h6"
              sx={{ marginBottom: 2, fontWeight: "bold" }}
            >
              Document
            </Typography>
            <Grid container spacing={2}>
              <Grid
                item
                xs={12}
                style={{ maxHeight: "80vh", overflow: "auto" }}
              >
                {documentContent && typeof documentContent === "string" && (
                  <Document
                    file={documentContent}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={pageNumber} style={{ width: "100%" }} />
                  </Document>
                )}
                {documentContent &&
                  typeof documentContent !== "string" &&
                  documentContent}
                {numPages && (
                  <div>
                    <p>
                      Page {pageNumber} of {numPages}
                    </p>
                    <Button
                      disabled={pageNumber <= 1}
                      onClick={() => setPageNumber(pageNumber - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      disabled={pageNumber >= numPages}
                      onClick={() => setPageNumber(pageNumber + 1)}
                    >
                      Next
                    </Button>

                    <Button component="a" href={documentContent} download>
                      Download PDF
                    </Button>
                  </div>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <ListItem>
                  <ListItemText
                    primary="Memo"
                    secondary={
                      <Typography color="primary">
                        {LoanApplication.memo}
                      </Typography>
                    }
                  />
                </ListItem>
              </Grid>
            </Grid>
          </Paper>
          {/* Transaction History */}
          <Typography variant="h6" sx={{ marginTop: 3, fontWeight: "bold" }}  ref={transactionHistoryRef}>
            Transaction History
          </Typography>
          <Paper elevation={2} sx={{ padding: 2, marginTop: 1 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.transactionId}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            handleEditTransactionClick(transaction)
                          }
                        >
                          <FaEdit />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleDeleteTransactionClick(
                              transaction.transactionId
                            )
                          }
                          style={{ color: "red" }}
                        >
                          <FaTrash />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button onClick={handleAddTransactionClick} sx={{ marginTop: 2 }}>
              Add Transaction
            </Button>
          </Paper>
          {/* Add Transaction Dialog */}
          <Dialog open={openAddTransaction} onClose={handleCloseAddTransaction}>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogContent>
              <TextField
                label="Date"
                name="date"
                value={newTransaction.date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Type"
                name="type"
                value={newTransaction.type}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={newTransaction.amount}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddTransaction}>Cancel</Button>
              <Button onClick={handleSaveTransaction}>Save</Button>
            </DialogActions>
          </Dialog>
          {/* Edit Transaction Dialog */}
          <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogContent>
              <TextField
                label="Date"
                name="date"
                value={editedTransaction.date}
                onChange={handleEditInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Type"
                name="type"
                value={editedTransaction.type}
                onChange={handleEditInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={editedTransaction.amount}
                onChange={handleEditInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={editedTransaction.description}
                onChange={handleEditInputChange}
                fullWidth
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog}>Cancel</Button>
              <Button onClick={handleSaveEditTransaction}>Save</Button>
            </DialogActions>
          </Dialog>
          ;{/* Delete Transaction Dialog */}
          <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this transaction?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
              <Button
                onClick={handleConfirmDeleteTransaction}
                style={{ color: "red" }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Layout>
    </ThemeProvider>
  );
};

export default LoanDetails;
