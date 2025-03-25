"use client";
import { useState, useEffect } from "react";
import StaffModal from "@/app/Components/StaffModal";
import styles from "../../Components/css/StaffModal.module.css";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Box,
} from "@mui/material";

const EditClient = ({ isOpen, onClose, client, onSaveEdit, onEditChange }) => {
  const [formData, setFormData] = useState(client || {});
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    onEditChange({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        image: URL.createObjectURL(file),
      });
      onEditChange({
        ...formData,
        image: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveEdit(formData);
    setMessage("Client updated successfully!");
    setTimeout(() => {
      setMessage("");
      onClose();
    }, 2000);
  };

  if (!isOpen || !client) return null;

  const inputFields = [
    { label: "Full Name", name: "fullName", type: "text" },
    { label: "Phone Number", name: "phoneNumber", type: "text" },
    { label: "Email Address", name: "emailAddress", type: "email" },
    { label: "Residential Address", name: "residentialAddress", type: "text" },
    { label: "Town", name: "town", type: "text" },
    { label: "State", name: "state", type: "text" },
    { label: "Nationality", name: "nationality", type: "text" },
    { label: "Occupation", name: "occupation", type: "text" },
    { label: "Employer", name: "employer", type: "text" },
    { label: "Employer Address", name: "employerAddress", type: "text" },
  ];

  const selectFields = [
    {
      label: "Gender",
      name: "gender",
      options: ["Male", "Female", "Other"],
    },
    {
      label: "Marital Status",
      name: "maritalStatus",
      options: ["Single", "Married", "Divorced"],
    },
  ];

  return (
    <StaffModal isOpen={isOpen} onClose={onClose} title="Edit Client">
      <form onSubmit={handleSubmit}>
        {message && <p className={styles.successMessage}>{message}</p>}
        <Box sx={{ marginBottom: 2 }}>
          {formData.image && (
            <Box sx={{ marginBottom: 1, display: 'flex', justifyContent: 'center'}}>
              <img
                src={formData.image}
                alt="Profile Preview"
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
            </Box>
          )}
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="raised-button-file"
            type="file"
            onChange={handlePictureChange}
          />
          <label htmlFor="raised-button-file" style={{display: 'flex', justifyContent: 'center'}}>
            <Button variant="contained" component="span" style={{ backgroundColor: "#50aa4e", color: "white" }}>
              Edit Profile Picture
            </Button>
          </label>
        </Box>
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
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}

          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth || ""}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
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
  );
};

export default EditClient;