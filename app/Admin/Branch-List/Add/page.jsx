"use client";
import React, { useState } from "react";
import styles from "../../../Components/css/Modal.module.css";
import branchService from "@/Services/branchService"; // Use the updated service

const AddBranch = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await branchService.addBranch(formData); // API call
      setMessage("New Branch Added!");
      onAdd(response.data); // Assuming your API returns the newly added branch data
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      setError("Failed to add branch. Please try again.");
      console.error("Error adding branch:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message && <p className={styles.successMessage}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formgrp}>
          <div>
            <label>Branch Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Branch Name"
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Branch Description"
              required
            />
          </div>
          <div>
            <label>Branch Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Branch Email"
              required
            />
          </div>
          <div>
            <label>Branch Phone:</label>
            <input
              type="text"
              name="phone"
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
            {loading ? "Adding..." : "Add Branch"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddBranch;
