"use client";
import React, { useState, useEffect, useRef } from "react";
import styles from "../../../Components/css/Modal.module.css";
import staffService from "@/Services/staffService";
import branchService from "@/Services/branchService";
import departmentService from "@/Services/departmentService";
import positionService from "@/Services/positionService";
import roleService from "@/Services/RoleService";

const AddStaff = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    martialStatus: "",
    dateOfBirth: "",
    address: "",
    email: "",
    phone: "",
    staffImage: "", // Now directly input for image URL
    roleID: "",
    positionID: "",
    departmentID: "",
    branchID: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Branch state
  const [branches, setBranches] = useState([]);
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
        if (response && Array.isArray(response)) {
          setBranches(response);
        } else if (response?.data && Array.isArray(response.data)) {
          setBranches(response.data);
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
        setRoleError("Failed to load roles.");
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const staffDataToSend = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      martialStatus: formData.martialStatus,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      email: { value: formData.email },
      phone: formData.phone,
      staffImage: formData.staffImage, // Directly the URL string
      roleID: formData.roleID,
      positionID: formData.positionID,
      departmentID: formData.departmentID,
      branchID: formData.branchID,
    };

    try {
      const response = await staffService.createStaff(staffDataToSend);
      console.log("Create Staff Response:", response);
      console.log("Form Data being sent:", staffDataToSend);

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Create Staff Error:", err.response || err);
      setError(
        err.response?.data?.message || "Failed to add staff. Please try again."
      );
    }

    setLoading(false);
  };

  return (
    <>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.formgrp}>
          <div>
            <label>First Name</label>
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
            <label>Last Name</label>
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
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Marital Status</label>
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
            <label>Date of Birth</label>
            <input
              type="text"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={styles.input}
              placeholder="yyyymmdd"
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Address"
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Staff E-mail"
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter Staff Contact"
            />
          </div>
          <div>
            <label>Staff Image URL</label>
            <input
              type="text"
              name="staffImage"
              value={formData.staffImage}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter URL of Staff Image"
            />
          </div>
          <div>
            <label>Role</label>
            <select
              name="roleID"
              value={formData.roleID}
              onChange={handleChange}
              className={styles.select}
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
            <label>Department</label>
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
            <label>Position</label>
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
            <label>Branch</label>
            <select
              name="branchID"
              value={formData.branchID}
              onChange={handleChange}
              className={styles.select}
              disabled={loadingBranches}
            >
              <option value="">Select Branch</option>
              {loadingBranches ? (
                <option disabled>Loading branches...</option>
              ) : branchError ? (
                <option disabled>{branchError}</option>
              ) : (
                branches.map((branch) => (
                  <option key={branch.branch_id} value={branch.branch_id}>
                    {branch.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
        <div className={styles.submit}>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Adding..." : "Add Staff"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddStaff;
