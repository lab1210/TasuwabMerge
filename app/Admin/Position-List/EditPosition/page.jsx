"use client";

import React, { useState, useEffect } from "react";
import styles from "../../../Components/css/Modal.module.css";
import positionService from "@/Services/positionService";

const EditPosition = ({ position, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: position?.name || "",
    description: position?.description || "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Update form data if the passed position prop changes
    if (position) {
      setFormData({
        name: position.name || "",
        description: position.description || "",
      });
    }
  }, [position]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await positionService.editPosition(
        position.position_id,
        formData
      );
      setMessage("Position updated successfully!");
      onUpdate(response); // Callback to refresh the position list
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      setError("Failed to update position. Please try again.");
      console.error("Error updating position:", err);
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
            <label htmlFor="name">Position Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Position Name"
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Description"
              required
            />
          </div>
        </div>

        <div className={styles.submit}>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
};

export default EditPosition;
