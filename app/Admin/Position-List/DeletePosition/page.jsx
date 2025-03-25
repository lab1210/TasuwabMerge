"use client";

import React, { useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import styles from "../../../Components/css/Modal.module.css";
import positionService from "@/Services/positionService";

const DeletePosition = ({ position, onClose, onDelete }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await positionService.deletePosition(position.position_id);
      setMessage(`Deleted position: ${position.name || ""}`);
      onDelete(); // Callback to refresh the position list
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      setError("Failed to delete position. Please try again.");
      console.error("Error deleting position:", err);
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
          Are you sure you want to delete "{position.name || ""}"?
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

export default DeletePosition;
