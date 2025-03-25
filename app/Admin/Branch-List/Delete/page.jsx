"use client";
import React, { useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import branchService from "@/Services/branchService"; // Import the updated service
import styles from "../../../Components/css/Modal.module.css";

const DeleteBranch = ({ branch = {}, onClose, onDelete }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await branchService.deleteBranch(branch.branch_id); // Use branch_id
      setMessage(`Deleted branch: ${branch.name || ""}`); // Use branch.name
      onDelete();
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      setError("Failed to delete branch. Please try again.");
      console.error("Error deleting branch:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {message && <p className={styles.successMessage}>{message}</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.confirm}>
        <div className={styles.top}>
          <RiErrorWarningLine size={80} />
        </div>
        <p>
          Are you sure you want to delete "{branch.name || ""}"?
          <span>You won't be able to revert this!</span>
        </p>
        <div className={styles.confirmBtn}>
          <button onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteBranch;
