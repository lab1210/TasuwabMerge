"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";

const VerifyOTP = () => {
  const searchParams = useSearchParams();
  const staffCode = searchParams.get("staffCode");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!staffCode) {
      setMessage("Invalid request.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (!otp.trim()) {
      setMessage("OTP is required.");
      return;
    }

    setLoading(true);
    setMessage("");

    // Simulate OTP verification and password reset
    setTimeout(() => {
      // In a real scenario, you'd verify the OTP against the stored value
      // and reset the password.
      // For this example, we'll just assume it's successful.
      setMessage("Password reset successful.");
      // router.push('/login'); // Optional redirect to login
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
          Verify OTP
        </Typography>
        <Typography
          variant="body2"
          align="center"
          gutterBottom
          sx={{ color: "#333" }}
        >
          An OTP has been sent to your email. Please enter it below to reset
          your password.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            margin="normal"
            required
            error={
              !!(
                message &&
                (message.startsWith("Invalid or expired OTP") ||
                  message.startsWith("OTP is required"))
              )
            }
            helperText={
              message &&
              (message.startsWith("Invalid or expired OTP") ||
                message.startsWith("OTP is required"))
                ? message
                : ""
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
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
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
          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            error={!!(message && message.startsWith("Passwords do not match"))}
            helperText={
              message && message.startsWith("Passwords do not match")
                ? message
                : ""
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
              "Verify and Reset"
            )}
          </Button>
        </form>
        {message &&
          !message.startsWith("Passwords do not match") &&
          !message.startsWith("Invalid or expired OTP") &&
          !message.startsWith("OTP is required") && (
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

export default VerifyOTP;
