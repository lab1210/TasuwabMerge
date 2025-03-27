"use client";
import styles from "../../page.module.css";
import { useState } from "react";
import { useAuth } from "@/Services/authService";
import Link from "next/link";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const result = await resetPassword(email);
      if (result && result.Success) {
        // Use 'Success' to match backend casing
        setMessage(
          result.Message // Use the message from the backend
        );
      } else {
        setError(result?.Message || "Failed to initiate password reset."); // Use the message from the backend
      }
    } catch (err) {
      setError(err || "Failed to initiate password reset.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Organization Logo" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.loginTitle}>
            <h1>Forgot Password</h1>
            <p>
              Enter your email address to receive a temporary password and set a
              new one.
            </p>
          </div>
          <div className={styles.formGroup}>
            <div>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          {message && <p className={styles.success}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.loginBtn} disabled={isLoading}>
            {isLoading ? "Sending..." : "Submit Email"}
          </button>
          <p style={{ marginTop: "15px", textAlign: "center" }}>
            <Link href="/">Back to Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
