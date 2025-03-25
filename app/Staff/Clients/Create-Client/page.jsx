"use client";
import React, { useState } from "react";
import Layout from "@/app/Components/Layout";
import styles from "../client.module.css";
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import clientdata from "../../../Components/data/ClientData";
import { useRouter } from "next/navigation";

const CreateClient = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    residentialAddress: "",
    town: "",
    state: "",
    nationality: "",
    occupation: "",
    employer: "",
    employerAddress: "",
    gender: "",
    maritalStatus: "",
    dateOfBirth: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        picture: file,
        picturePreview: URL.createObjectURL(file), // Corrected line
      });
    } else {
      setFormData({ ...formData, picture: null, picturePreview: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const newClientId = Date.now().toString();
      const newClient = { ...formData, clientId: newClientId };
      clientdata.push(newClient);

      console.log("Client created successfully:", newClient);
      setSuccessMessage("Client created successfully!");
      setErrorMessage("");

      setFormData({
        fullName: "",
        phoneNumber: "",
        emailAddress: "",
        residentialAddress: "",
        town: "",
        state: "",
        nationality: "",
        occupation: "",
        employer: "",
        employerAddress: "",
        gender: "",
        maritalStatus: "",
        dateOfBirth: "",
        picture: null,
      });

      setTimeout(() => {
        setSuccessMessage("");
        router.push("/Staff/Clients");
      }, 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Error creating client:", error);
      setErrorMessage("Failed to create client. Please try again.");
      setSuccessMessage("");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
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
    "& .MuiOutlinedInput-root": {
      "&:focus-within": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(80, 170, 78, 0.5)",
          boxShadow: "0 0 0 0.2rem rgba(80, 170, 78, 0.25)",
        },
      },
    },
    "& label.Mui-focused": {
      color: "#50aa4e",
    },
  };

  return (
    <Layout>
      <div className={styles.ListWrapper}>
        <div className={styles.top}>
          <div>
            <h1>Create Client Account</h1>
            <p>Fill in the form below to create a new client account.</p>
          </div>
        </div>
        <div className={styles.bottom}>
          <form onSubmit={handleSubmit}>
            {successMessage && (
              <p className={styles.successMessage}>{successMessage}</p>
            )}
            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}
            <div style={{ marginBottom: "20px" }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
                onChange={handlePictureChange}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="contained"
                  component="span"
                  style={{ backgroundColor: "#333" }}
                >
                  Upload Profile Picture
                </Button>
              </label>
              {formData.picturePreview && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={formData.picturePreview}
                    alt="Profile Preview"
                    style={{ maxWidth: "150px" }}
                  />
                  <p>{formData.picture.name}</p>
                </div>
              )}
            </div>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle} // Apply focus style
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle} // Apply focus style
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle} // Apply focus style
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Residential Address"
                  name="residentialAddress"
                  value={formData.residentialAddress}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle} // Apply focus style
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Town"
                  name="town"
                  value={formData.town}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle} // Apply focus style
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle} // Apply focus style
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle} // Apply focus style
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle} // Apply focus style
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Employer"
                  name="employer"
                  value={formData.employer}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle} // Apply focus style
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Employer Address"
                  name="employerAddress"
                  value={formData.employerAddress}
                  onChange={handleChange}
                  fullWidth
                  sx={textFieldStyle} // Apply focus style
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={selectStyle}>
                  <InputLabel id="gender-select-label">Gender</InputLabel>
                  <Select
                    labelId="gender-select-label"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Gender"
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={selectStyle}>
                  <InputLabel id="maritalStatus-select-label">
                    Marital Status
                  </InputLabel>
                  <Select
                    labelId="maritalStatus-select-label"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    label="Marital Status"
                  >
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Married">Married</MenuItem>
                    <MenuItem value="Divorced">Divorced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={textFieldStyle} // Apply focus style
                />
              </Grid>
            </Grid>
            <div style={{ marginTop: "20px" }}>
              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "#50aa4e" }}
              >
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateClient;
