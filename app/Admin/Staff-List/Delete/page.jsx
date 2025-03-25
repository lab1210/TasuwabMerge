"use client";
import React, { useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import styles from "../../../Components/css/Modal.module.css";
import staffService from "@/Services/staffService"; // Import the entire service

const DeleteStaff = ({ staff = {}, onClose, onDelete }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(""); // State for delete-specific error

  const handleDelete = async () => {
    if (!staff?.staffCode) {
      setMessage("Staff code is missing.");
      return;
    }

    try {
      setLoading(true);
      setDeleteError(""); // Clear any previous error
      await staffService.deleteStaff(staff.staffCode); // Use deleteStaff from service

      setMessage(`Deleted Staff: ${staff.firstName} ${staff.lastName}`);

      // Refresh the staff list after successful deletion
      onDelete();

      setTimeout(() => {
        setMessage(""); // Remove message after 2 seconds
        onClose(); // Close modal
      }, 2000);
    } catch (error) {
      console.error("Error deleting staff:", error);
      setDeleteError(
        error.response?.data?.message ||
          "Error deleting staff. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message && <p className={styles.successMessage}>{message}</p>}
      {deleteError && <p className={styles.error}>{deleteError}</p>}

      <div className={styles.confirm}>
        <div className={styles.top}>
          <RiErrorWarningLine size={80} />
        </div>
        <p>
          Are you sure you want to delete{" "}
          <strong>
            "{staff?.firstName}
            {staff?.lastName ? ` ${staff.lastName}` : ""}"
          </strong>
          ?
          <span className={styles.warningText}>
            This action cannot be undone!
          </span>
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

export default DeleteStaff;
