"use client";
import styles from "../../page.module.css";
import { useState } from "react";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useAuth } from "@/Services/authService"; // Import useAuth

export default function SetPassword() {
  const { setPassword } = useAuth(); // Use the setPassword function from the auth service
  const router = useRouter();
  const [showDefaultPassword, setShowDefaultPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [staffCode, setStaffCode] = useState("");
  const [defaultPassword, setDefaultPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleDefaultPasswordVisibility = () => {
    setShowDefaultPassword(!showDefaultPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!staffCode || !defaultPassword || !newPassword) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    try {
      await setPassword(staffCode, defaultPassword, newPassword);
      setSuccessMessage(
        "Password has been set successfully. You can now login."
      );
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err) {
      console.error("Error setting password:", err);
      setError(err || "Failed to set password.");
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
            <h1>Set New Password</h1>
            <p>Please set your new password.</p>
          </div>
          <div className={styles.formGroup}>
            <div>
              <label htmlFor="staffCode">Staff Code</label>
              <input
                id="staffCode"
                type="text"
                placeholder="Enter Staff Code"
                value={staffCode}
                onChange={(e) => setStaffCode(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="defaultPassword">Default Password</label>
              <div className={styles.toggle}>
                <input
                  id="defaultPassword"
                  type={showDefaultPassword ? "text" : "password"}
                  placeholder="Enter Default Password"
                  value={defaultPassword}
                  onChange={(e) => setDefaultPassword(e.target.value)}
                  required
                />
                {showDefaultPassword ? (
                  <LuEye size={20} onClick={toggleDefaultPasswordVisibility} />
                ) : (
                  <LuEyeClosed
                    size={20}
                    onClick={toggleDefaultPasswordVisibility}
                  />
                )}
              </div>
            </div>
            <div>
              <label htmlFor="newPassword">New Password</label>
              <div className={styles.toggle}>
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                {showNewPassword ? (
                  <LuEye size={20} onClick={toggleNewPasswordVisibility} />
                ) : (
                  <LuEyeClosed
                    size={20}
                    onClick={toggleNewPasswordVisibility}
                  />
                )}
              </div>
            </div>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}
          <button className={styles.loginBtn} disabled={isLoading}>
            {isLoading ? "Setting Password..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
