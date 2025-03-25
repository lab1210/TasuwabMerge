"use client";
import React, { useState, useEffect } from "react";
import styles from "../../../Components/css/Modal.module.css";
import roleService from "@/Services/RoleService";

const EditRole = ({ role, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    role_id: role?.role_id || "", // Added role_id field and initialized
    name: role?.name || "",
    description: role?.description || "",
    privilegeIds: role?.privileges?.map((p) => p.privilegeId) || [],
  });
  const [allPrivileges, setAllPrivileges] = useState([]);
  const [loadingPrivileges, setLoadingPrivileges] = useState(true);
  const [privilegesError, setPrivilegesError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchPrivileges();
  }, []);

  useEffect(() => {
    if (allPrivileges.length > 0) {
      setSelectAll(formData.privilegeIds.length === allPrivileges.length);
    }
  }, [formData.privilegeIds, allPrivileges]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      privilegeIds: selectAll
        ? allPrivileges.map((p) => p.privilegeId)
        : prevData.privilegeIds,
    }));
  }, [selectAll, allPrivileges]);

  const fetchPrivileges = async () => {
    setLoadingPrivileges(true);
    setPrivilegesError(null);
    try {
      const response = await roleService.getAllPrivileges();
      if (response?.data && Array.isArray(response.data)) {
        setAllPrivileges(response.data);
      } else if (Array.isArray(response)) {
        setAllPrivileges(response);
      } else {
        console.warn("Unexpected privileges data format:", response);
        setPrivilegesError("Failed to load privileges.");
        setAllPrivileges([]);
      }
    } catch (err) {
      console.error("Error fetching privileges:", err);
      setPrivilegesError("Failed to load privileges.");
      setAllPrivileges([]);
    } finally {
      setLoadingPrivileges(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePrivilegeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      privilegeIds: checked
        ? [...prevData.privilegeIds, value]
        : prevData.privilegeIds.filter((id) => id !== value),
    }));
    if (!checked && selectAll) {
      setSelectAll(false);
    } else if (
      checked &&
      formData.privilegeIds.length + 1 === allPrivileges.length &&
      !selectAll
    ) {
      setSelectAll(true);
    }
  };

  const handleSelectAllChange = (e) => {
    setSelectAll(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await roleService.updateRole(formData.role_id, {
        role_id: formData.role_id,
        name: formData.name,
        description: formData.description,
        privilegeIds: formData.privilegeIds,
      });
      setMessage(`Role "${response.name}" updated successfully!`);
      onUpdate(response);
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 2000);
    } catch (err) {
      setError("Failed to update role. Please try again.");
      console.error("Error updating role:", err);
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
            <label htmlFor="role_id">Role ID:</label>
            <input
              type="text"
              id="role_id"
              name="role_id"
              value={formData.role_id}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter Role ID"
              readOnly // Make it read-only as it's usually not changed
            />
          </div>
          <div>
            <label htmlFor="name">Role Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter Role Name"
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
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Enter Description"
              required
            />
          </div>
        </div>

        <div>
          <label>Assign Privileges:</label>
          {loadingPrivileges ? (
            <p>Loading privileges...</p>
          ) : privilegesError ? (
            <p className={styles.error}>{privilegesError}</p>
          ) : (
            <div className={styles.privilegesContainer}>
              <div className={styles.selectAll}>
                <input
                  type="checkbox"
                  id="selectAllPrivileges"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                <label htmlFor="selectAllPrivileges">Select All</label>
              </div>
              <div className={styles.privilegesList}>
                {allPrivileges.map((privilege) => (
                  <div
                    key={privilege.privilegeId}
                    className={styles.privilegeItem}
                  >
                    <input
                      type="checkbox"
                      id={`privilege-${privilege.privilegeId}`}
                      name="privilegeIds"
                      value={privilege.privilegeId}
                      checked={formData.privilegeIds.includes(
                        privilege.privilegeId
                      )}
                      onChange={handlePrivilegeChange}
                    />
                    <label htmlFor={`privilege-${privilege.privilegeId}`}>
                      {privilege.name} ({privilege.description})
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.submit}>
          <button
            type="submit"
            className={styles.button}
            disabled={loading || loadingPrivileges}
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </>
  );
};

export default EditRole;
