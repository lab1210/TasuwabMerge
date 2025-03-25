// pages/forgot-password.js
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

const ForgotPassword = () => {
  const [staffCode, setStaffCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation (example)
    if (!staffCode.trim()) {
      setMessage("Staff Code is required.");
      return;
    }

    setLoading(true);
    setMessage("");

    // Simulate OTP sending (replace with your actual logic later)
    setTimeout(() => {
      // In a real scenario, you'd check if the staff code exists and generate an OTP
      // For this example, we'll just assume it's "sent" successfully
      setMessage("OTP sent to your email. Please check your inbox.");
      router.push(`/Authentication/Verify-OTP?staffCode=${staffCode}`);
      setLoading(false);
    }, 1000); // Simulate a 1-second delay

    // No axios call here anymore
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        backgroundColor: "#ffffff",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 400,
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ color: "#333" }}
        >
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Staff Code"
            value={staffCode}
            onChange={(e) => setStaffCode(e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!!(message && message.startsWith("Staff Code"))}
            helperText={
              message && message.startsWith("Staff Code") ? message : ""
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:focus-within": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#50aa4e",
                    boxShadow: "0 0 0 0.2rem rgba(80, 170, 78, 0.25)",
                  },
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              marginTop: 2,
              backgroundColor: "#50aa4e",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#40993e",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Send OTP"
            )}
          </Button>
        </form>
        {message && !message.startsWith("Staff Code") && (
          <Alert
            severity={message.startsWith("Error") ? "error" : "success"}
            sx={{ marginTop: 2 }}
          >
            {message}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
