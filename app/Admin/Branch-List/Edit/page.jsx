"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../Components/css/Modal.module.css";
import branchService from "@/Services/branchService"; // Use the updated service

const EditBranch = ({ branch = {}, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    description: branch.description || "", // Updated to description
    email: branch.email || "", // Updated to email
    phone: branch.phone || "", // Updated to phone
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (branch) {
      setFormData({
        description: branch.description || "",
        email: branch.email || "",
        phone: branch.phone || "",
      });
    }
  }, [branch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await branchService.editBranch(
        branch.branch_id,
        formData
      ); // Use branch_id for update
      setMessage("Branch updated successfully!");
      onUpdate(response.data); // Update UI in parent component
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      setError("Failed to update branch. Please try again.");
      console.error("Error updating branch:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message && <p className={styles.successMessage}>{message}</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formgrp}>
          <div>
            <label>Description:</label>
            <input
              type="text"
              name="description" // Updated to description
              value={formData.description}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Branch Description"
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email" // Updated to email
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Branch Email"
              required
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone" // Updated to phone
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Branch Phone"
              required
            />
          </div>
        </div>
        <div className={styles.submit}>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
};

export default EditBranch;
