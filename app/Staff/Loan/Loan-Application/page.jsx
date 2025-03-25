"use client";
import React, { useState, useRef, useEffect } from "react";
import Layout from "@/app/Components/Layout";
import styles from "../../Clients/client.module.css";
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  List,
  ListItem,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import loanData from "@/app/Components/data/LoanData";
import clientdata from "@/app/Components/data/ClientData";
import { useRouter } from "next/navigation";

const LoanApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    clientInfo: null,
    bank: "",
    bankAccount: "",
    loanRequestAmount: "",
    loanType: "",
    interestType: "",
    loanPurpose: "",
    guarantor1Name: "",
    guarantor1Address: "",
    guarantor2Name: "",
    guarantor2Address: "",
    documentFile: null,
    memo: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [showClientNames, setShowClientNames] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "documentFile" && files && files[0]) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        documentFile: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    if (name === "clientName") {
      const filteredClient = clientdata.find((client) =>
        client.fullName.toLowerCase().startsWith(value.toLowerCase())
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        clientInfo: filteredClient,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!formData.clientInfo) {
        setErrorMessage("Client not found. Please enter a valid client name.");
        setSuccessMessage("");
        return;
      } else {
        setErrorMessage("");
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 4) {
      try {
        const lastLoan = loanData[loanData.length - 1];
        const newId = lastLoan.LoanApplication.id + 1;

        const newLoan = {
          LoanApplication: {
            id: newId,
            clientId: parseInt(formData.clientId),
            bank: formData.bank,
            bankAccount: formData.bankAccount,
            loanRequestAmount: formData.loanRequestAmount,
            loanType: formData.loanType,
            interestType: formData.interestType,
            loanPurpose: formData.loanPurpose,
            guarantor1Name: formData.guarantor1Name,
            guarantor1Address: formData.guarantor1Address,
            guarantor2Name: formData.guarantor2Name,
            guarantor2Address: formData.guarantor2Address,
            documentUrl: formData.documentFile
              ? formData.documentFile.name
              : null,
            memo: formData.memo,
          },
        };

        loanData.push(newLoan);
        console.log("Loan application created successfully:", newLoan);
        setSuccessMessage("Loan application created successfully!");
        setErrorMessage("");

        setFormData({
          clientId: "",
          clientName: "",
          clientInfo: null,
          bank: "",
          bankAccount: "",
          loanRequestAmount: "",
          loanType: "",
          interestType: "",
          loanPurpose: "",
          guarantor1Name: "",
          guarantor1Address: "",
          guarantor2Name: "",
          guarantor2Address: "",
          documentUrl: "",
          memo: "",
        });

        setTimeout(() => {
          setSuccessMessage("");
          router.push("/Staff/Loan");
        }, 3000);
      } catch (error) {
        console.error("Error creating loan application:", error);
        setErrorMessage("Failed to create loan application. Please try again.");
        setSuccessMessage("");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleClientNameClick = () => {
    setShowClientNames(true);
  };

  const handleClientNameItemClick = (name) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      clientName: name,
      clientInfo: clientdata.find((client) => client.fullName === name),
    }));
    setShowClientNames(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowClientNames(false);
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
            Create Loan Application
          </Typography>
          <Typography variant="body1" gutterBottom style={{ color: "#333" }}>
            Fill in the form below to create a new loan application.
          </Typography>

          <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            {successMessage && (
              <Typography
                variant="body1"
                className={styles.successMessage}
                style={{ color: "#50aa4e" }}
              >
                {successMessage}
              </Typography>
            )}
            {errorMessage && (
              <Typography
                variant="body1"
                className={styles.errorMessage}
                style={{ color: "red" }}
              >
                {errorMessage}
              </Typography>
            )}

            {currentStep === 1 && (
              <div>
                <Typography
                  variant="h6"
                  style={{ color: "#333", marginTop: "20px" }}
                >
                  Personal Information
                </Typography>
                <Grid container spacing={2} style={{ marginTop: "10px" }}>
                  <Grid item xs={12}>
                    <div ref={inputRef}>
                      <TextField
                        label="Client Name"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        fullWidth
                        onClick={handleClientNameClick}
                        sx={textFieldStyle} // Apply focus style
                      />
                      {showClientNames && (
                        <List
                          sx={{
                            position: "absolute",
                            backgroundColor: "white",
                            border: "1px solid #ccc",
                            zIndex: 1000,
                            width: "100%",
                          }}
                        >
                          {clientdata.map((client) => (
                            <ListItem
                              button
                              key={client.id}
                              onClick={() =>
                                handleClientNameItemClick(client.fullName)
                              }
                            >
                              {client.fullName}
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </div>
                  </Grid>
                </Grid>
                {formData.clientInfo && (
                  <Box sx={{ marginTop: "10px", color: "#333" }}>
                    <Typography variant="body1">
                      <strong>Name:</strong> {formData.clientInfo.fullName}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Phone:</strong> {formData.clientInfo.phoneNumber}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Email:</strong> {formData.clientInfo.emailAddress}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ marginTop: "20px" }}>
                  <Button
                    type="button"
                    variant="contained"
                    style={{ backgroundColor: "#50aa4e" }}
                    onClick={handleSubmit}
                  >
                    Next
                  </Button>
                </Box>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <Typography
                  variant="h6"
                  style={{ color: "#333", marginTop: "20px" }}
                >
                  Bank Information
                </Typography>
                <Grid container spacing={2} style={{ marginTop: "10px" }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Bank"
                      name="bank"
                      value={formData.bank}
                      onChange={handleChange}
                      fullWidth
                      sx={textFieldStyle} // Apply focus style
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Bank Account"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleChange}
                      fullWidth
                      sx={textFieldStyle} // Apply focus style
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Loan Request Amount"
                      name="loanRequestAmount"
                      value={formData.loanRequestAmount}
                      onChange={handleChange}
                      fullWidth
                      sx={textFieldStyle} // Apply focus style
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={selectStyle}>
                      <InputLabel id="loan-type-label">Loan Type</InputLabel>
                      <Select
                        labelId="loan-type-label"
                        name="loanType"
                        value={formData.loanType}
                        onChange={handleChange}
                        label="Loan Type"
                      >
                        <MenuItem value={"Personal"}>Personal</MenuItem>
                        <MenuItem value={"Business"}>Business</MenuItem>
                        <MenuItem value={"Mortgage"}>Mortgage</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={selectStyle}>
                      <InputLabel id="interest-type-label">
                        Interest Type
                      </InputLabel>
                      <Select
                        labelId="interest-type-label"
                        name="interestType"
                        value={formData.interestType}
                        onChange={handleChange}
                        label="Interest Type"
                      
                      >
                        <MenuItem value={"Fixed"}>Fixed</MenuItem>
                        <MenuItem value={"Variable"}>Variable</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Loan Purpose"
                      name="loanPurpose"
                      value={formData.loanPurpose}
                      onChange={handleChange}
                      fullWidth
                      sx={textFieldStyle} // Apply focus style
                    />
                  </Grid>
                </Grid>
                <Box sx={{ marginTop: "20px" }}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handlePrevious}
                    style={{ backgroundColor: "#333" }}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    style={{ backgroundColor: "#50aa4e" }}
                    onClick={handleSubmit}
                  >
                    Next
                  </Button>
                </Box>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <Typography
                  variant="h6"
                  style={{ color: "#333", marginTop: "20px" }}
                >
                  Guarantor Information
                </Typography>
                <Grid container spacing={2} style={{ marginTop: "10px" }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Guarantor 1 Name"
                      name="guarantor1Name"
                      value={formData.guarantor1Name}
                      onChange={handleChange}
                      fullWidth
                      sx={textFieldStyle} // Apply focus style
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Guarantor 1 Address"
                      name="guarantor1Address"
                      value={formData.guarantor1Address}
                      onChange={handleChange}
                      fullWidth
                      sx={textFieldStyle} // Apply focus style
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Guarantor 2 Name"
                      name="guarantor2Name"
                      value={formData.guarantor2Name}
                      onChange={handleChange}
                      fullWidth
                      sx={textFieldStyle} // Apply focus style
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Guarantor 2 Address"
                      name="guarantor2Address"
                      value={formData.guarantor2Address}
                      onChange={handleChange}
                      fullWidth
                      sx={textFieldStyle} // Apply focus style
                    />
                  </Grid>
                </Grid>
                <Box sx={{ marginTop: "20px" }}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handlePrevious}
                    style={{ backgroundColor: "#333" }}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    style={{ backgroundColor: "#50aa4e" }}
                    onClick={handleSubmit}
                  >
                    Next
                  </Button>
                </Box>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <Typography
                  variant="h6"
                  style={{ color: "#333", marginTop: "20px" }}
                >
                  Document Upload
                </Typography>
                <Grid container spacing={2} style={{ marginTop: "10px" }}>
                  <Grid item xs={12}>
                    <input
                      type="file"
                      name="documentFile"
                      accept=".pdf, image/*, .doc, .docx"
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Memo"
                      name="memo"
                      multiline
                      rows={4}
                      value={formData.memo}
                      onChange={handleChange}
                      fullWidth
                      sx={textFieldStyle} // Apply focus style
                    />
                  </Grid>
                </Grid>
                <Box sx={{ marginTop: "20px" }}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handlePrevious}
                    style={{ backgroundColor: "#333" }}
                  >
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: "#50aa4e" }}
                  >
                    Submit Loan Application
                  </Button>
                </Box>
              </div>
            )}
          </form>
        </Paper>
      </Box>
    </Layout>
  );
};

export default LoanApplication;
