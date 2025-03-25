"use client";

import React, { useState } from "react";
import styles from "../../../Components/css/Modal.module.css";
import departmentService from "@/Services/departmentService";

const AddDepartment = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    is_active: true,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await departmentService.addDepartment({
        ...formData,
        is_visible: true, // Set is_visible to true (or your desired default)
      });
      setMessage("Department added successfully!");
      onAdd(response);
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      setError("Failed to add department. Please try again.");
      console.error("Error adding department:", err);
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
          {/* Form fields for name, description, email, phone, is_active */}
          <div>
            <label htmlFor="name">Department Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Department Name"
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
            />
          </div>
        </div>

        <div className={styles.formgrp}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Email"
            />
          </div>
          <div>
            <label htmlFor="phone">Phone:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Phone"
            />
          </div>
        </div>

        <div className={styles.formgrp}>
          <div>
            <label htmlFor="is_active">Is Active:</label>
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className={styles.checkbox}
            />
          </div>
          {/* is_visible is not here */}
        </div>

        <div className={styles.submit}>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Adding..." : "Add Department"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddDepartment;
