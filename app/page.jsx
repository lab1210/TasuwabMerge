"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import Link from "next/link";
import { useAuth } from "@/Services/authService";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Login() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrStaffCode, setEmailOrStaffCode] = useState(""); // Changed from StaffCode
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Corrected variable name (lowercase 'error')
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize router

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setIsLoading(true);

    try {
      await login(emailOrStaffCode, password); // Use emailOrStaffCode
    } catch (err) {
      // Handle specific error messages from the API
      if (err && err.includes("Login failed")) {
        setError(err); // Display the error from the API
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.loginTitle}>
            <h1>Organization Login</h1>
            <p>Please login here to access your organization account</p>
          </div>
          <div className={styles.formGroup}>
            <div>
              <label htmlFor="emailOrStaffCode">Email or Staff Code</label>
              <input
                id="emailOrStaffCode"
                type="text"
                placeholder="Enter Email or Staff Code"
                value={emailOrStaffCode}
                onChange={(e) => setEmailOrStaffCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <div className={styles.toggle}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {showPassword ? (
                  <LuEye size={20} onClick={togglePasswordVisibility} />
                ) : (
                  <LuEyeClosed size={20} onClick={togglePasswordVisibility} />
                )}
              </div>
              <Link href="/Authentication/Forgot-Password">
                <p className={styles.forgotPswd}>Forgot Password?</p>
              </Link>
            </div>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.loginBtn} disabled={isLoading}>
            {isLoading ? "Logging In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
