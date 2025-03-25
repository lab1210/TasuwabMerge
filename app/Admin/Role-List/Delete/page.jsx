"use client";
import React, { useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import roleService from "@/Services/RoleService"; // Import role service
import styles from "../../../Components/css/Modal.module.css";

const DeleteRole = ({ role = {}, onClose, onDelete }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await roleService.deleteRole(role.role_id); // Use role.role_id
      setMessage(`Deleted role: ${role.name || ""}`); // Use role.name
      onDelete();
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      setError("Failed to delete role. Please try again.");
      console.error("Error deleting role:", err);
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
          Are you sure you want to delete "{role.name || ""}"?
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

export default DeleteRole;
