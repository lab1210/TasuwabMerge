"use client";

import React, { useState } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import styles from "../../../Components/css/Modal.module.css";
import departmentService from "@/Services/departmentService";

const DeleteDepartment = ({ department, onClose, onDelete }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await departmentService.deleteDepartment(department.department_id);
      setMessage(`Deleted department: ${department.name || ""}`);
      onDelete(); // Callback to refresh the department list
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      setError("Failed to delete department. Please try again.");
      console.error("Error deleting department:", err);
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
          Are you sure you want to delete "{department.name || ""}"?
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

export default DeleteDepartment;
