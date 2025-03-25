"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../Components/css/Modal.module.css";
import staffService from "@/Services/staffService"; // Import the entire service
import branchService from "@/Services/branchService";
import departmentService from "@/Services/departmentService";
import positionService from "@/Services/positionService";
import roleService from "@/Services/RoleService";

const EditStaff = ({ staff = {}, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    staffCode: staff.staffCode || "",
    firstName: staff.firstName || "",
    lastName: staff.lastName || "",
    gender: staff.gender || "",
    martialStatus: staff.martialStatus || "",
    dateOfBirth: staff.dateOfBirth || 0, // Initialize as number
    address: staff.address || "",
    email: { value: staff.email || "" }, // Nested email object
    phone: staff.phone || "",
    staffImage: staff.staffImage || "",
    roleID: staff.roleID || "",
    positionID: staff.positionID || "",
    departmentID: staff.departmentID || "",
    branchID: staff.branchID || "",
  });

  const [message, setMessage] = useState("");
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState("");
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [branchError, setBranchError] = useState(null);

  // Department state
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [departmentError, setDepartmentError] = useState(null);

  // Position state
  const [positions, setPositions] = useState([]);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [positionError, setPositionError] = useState(null);

  // Role state
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [roleError, setRoleError] = useState(null);

  useEffect(() => {
    async function fetchBranches() {
      try {
        setLoadingBranches(true);
        const response = await branchService.getAllBranches();

        console.log("Branches API response:", response);

        if (response?.data && Array.isArray(response.data)) {
          setBranches(response.data);
        } else if (response && Array.isArray(response)) {
          setBranches(response);
        } else {
          console.error("Unexpected response format for branches:", response);
          setBranchError("Failed to load branches.");
          setBranches([]);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
        setBranchError("Error fetching branches.");
        setBranches([]);
      } finally {
        setLoadingBranches(false);
      }
    }

    async function fetchDepartments() {
      try {
        setLoadingDepartments(true);
        const response = await departmentService.getAllDepartments();
        if (response && Array.isArray(response)) {
          setDepartments(response);
        } else if (response?.data && Array.isArray(response.data)) {
          setDepartments(response.data);
        } else {
          console.error(
            "Unexpected response format for departments:",
            response
          );
          setDepartmentError("Failed to load departments.");
          setDepartments([]);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setDepartmentError("Error fetching departments.");
        setDepartments([]);
      } finally {
        setLoadingDepartments(false);
      }
    }

    async function fetchPositions() {
      try {
        setLoadingPositions(true);
        const response = await positionService.getAllPositions();
        if (response && Array.isArray(response)) {
          setPositions(response);
        } else if (response?.data && Array.isArray(response.data)) {
          setPositions(response.data);
        } else {
          console.error("Unexpected response format for positions:", response);
          setPositionError("Failed to load positions.");
          setPositions([]);
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
        setPositionError("Error fetching positions.");
        setPositions([]);
      } finally {
        setLoadingPositions(false);
      }
    }

    async function fetchRoles() {
      try {
        setLoadingRoles(true);
        const response = await roleService.getAllRoles();
        if (response && Array.isArray(response)) {
          setRoles(response);
        } else if (response?.data && Array.isArray(response.data)) {
          setRoles(response.data);
        } else {
          console.error("Unexpected response format for roles:", response);
          setRoleError("Failed to load roles.");
          setRoles([]);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoleError("Error fetching roles.");
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    }

    fetchBranches();
    fetchDepartments();
    fetchPositions();
    fetchRoles();
  }, []);

  useEffect(() => {
    if (staff) {
      setFormData({
        staffCode: staff.staffCode || "",
        firstName: staff.firstName || "",
        lastName: staff.lastName || "",
        gender: staff.gender || "",
        martialStatus: staff.martialStatus || "",
        dateOfBirth: staff.dateOfBirth || 0, // Ensure it's a number
        address: staff.address || "",
        email: { value: staff.email || "" }, // Set nested email
        phone: staff.phone || "",
        staffImage: staff.staffImage || "",
        roleID: staff.roleID || "",
        positionID: staff.positionID || "",
        departmentID: staff.departmentID || "",
        branchID: staff.branchID || "",
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setFormData({ ...formData, email: { value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await staffService.editStaff(formData); // Use editStaff
      if (response.status === 200) {
        setMessage("Staff updated successfully!");
        onUpdate(); // Refresh staff list in parent component
        setTimeout(() => {
          setMessage("");
          onClose();
        }, 2000);
      } else {
        setError(response.data?.message || "Failed to update staff.");
      }
    } catch (err) {
      setError("Failed to update staff. Please try again.");
      console.error("Error updating staff:", err);
    }
  };

  return (
    <>
      {message && <p className={styles.successMessage}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formgrp}>
          <div>
            <label>Staff Code:</label>
            <input
              type="text"
              name="staffCode"
              value={formData.staffCode}
              className={styles.input}
              readOnly // Staff Code should likely not be editable
            />
          </div>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter First Name"
              required
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Last Name"
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email.value} // Access nested value
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Staff E-mail"
              required
            />
          </div>
          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Staff Contact"
              required
            />
          </div>
          <div>
            <label>Branch:</label>
            <select
              name="branchID"
              value={formData.branchID}
              onChange={handleChange}
              className={styles.select}
              required
              disabled={loadingBranches}
            >
              <option value="">Select Branch</option>
              {loadingBranches ? (
                <option disabled>Loading branches...</option>
              ) : branchError ? (
                <option disabled>{branchError}</option>
              ) : (
                branches.map((branch) => (
                  <option
                    key={branch.branch_id || branch.branch_code}
                    value={branch.branch_id} // Use branch.id as value
                  >
                    {branch.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label>Role:</label>
            <select
              name="roleID"
              value={formData.roleID}
              onChange={handleChange}
              className={styles.select}
              required
              disabled={loadingRoles}
            >
              <option value="">Select Role</option>
              {loadingRoles ? (
                <option disabled>Loading roles...</option>
              ) : roleError ? (
                <option disabled>{roleError}</option>
              ) : (
                roles.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Date of Birth:</label>
            <input
              type="text"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={styles.input}
              placeholder="YYYYMMDD"
              required
            />
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Address"
              required
            />
          </div>
          <div>
            <label>Marital Status:</label>
            <select
              name="martialStatus"
              value={formData.martialStatus}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          <div>
            <label>Department:</label>
            <select
              name="departmentID"
              value={formData.departmentID}
              onChange={handleChange}
              className={styles.select}
              disabled={loadingDepartments}
            >
              <option value="">Select Department</option>
              {loadingDepartments ? (
                <option disabled>Loading departments...</option>
              ) : departmentError ? (
                <option disabled>{departmentError}</option>
              ) : (
                departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label>Position:</label>
            <select
              name="positionID"
              value={formData.positionID}
              onChange={handleChange}
              className={styles.select}
              disabled={loadingPositions}
            >
              <option value="">Select Position</option>
              {loadingPositions ? (
                <option disabled>Loading positions...</option>
              ) : positionError ? (
                <option disabled>{positionError}</option>
              ) : (
                positions.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    {pos.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label>Staff Image URL:</label>
            <input
              type="text"
              name="staffImage"
              value={formData.staffImage}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter URL of Staff Image"
            />
          </div>
        </div>
        <div className={styles.submit}>
          <button type="submit" className={styles.button}>
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
};

export default EditStaff;
