"use client";

import React, { useState, useEffect } from "react";
import styles from "../../Components/css/Admin.module.css";
import Layout from "@/app/Components/Layout";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "@/app/Components/Modal";
import departmentService from "@/Services/departmentService";
import { HashLoader } from "react-spinners";
import { useAuth } from "@/Services/authService"; // Import useAuth
import EditDepartment from "./Edit/page";
import AddDepartment from "./Add/page";
import DeleteDepartment from "./Delete/page";
import axios from "axios";
const DepartmentList = () => {
  const [filterText, setFilterText] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activatingId, setActivatingId] = useState(null);
  const [deactivatingId, setDeactivatingId] = useState(null);
  const [activationError, setActivationError] = useState(null);
  const [deactivationError, setDeactivationError] = useState(null);
  const { user } = useAuth();
  const [rolePrivileges, setRolePrivileges] = useState([]);
  const [loadingPrivileges, setLoadingPrivileges] = useState(true);

  useEffect(() => {
    const fetchPrivileges = async () => {
      if (user?.role) {
        setLoadingPrivileges(true);
        try {
          const allRolesResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/Role/all`
          );
          const allRoles = allRolesResponse.data;
          const foundRole = allRoles.find((r) => r.role_id === user.role);
          setRolePrivileges(foundRole?.privileges?.map((p) => p.name) || []);
        } catch (error) {
          console.error("Error fetching roles:", error);
          setRolePrivileges([]);
        } finally {
          setLoadingPrivileges(false);
        }
      } else {
        setRolePrivileges([]);
        setLoadingPrivileges(false);
      }
    };

    fetchPrivileges();
  }, [user?.role]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await departmentService.getAllDepartments();
      if (response?.data && Array.isArray(response.data)) {
        setDepartments(response.data);
      } else if (Array.isArray(response)) {
        setDepartments(response);
      } else {
        console.warn("Unexpected department data format:", response);
        setError("Failed to load departments: Data format incorrect.");
        setDepartments([]);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      setError("Failed to load departments.");
      setDepartments([]);
    } finally {
      setLoading(false);
      setActivatingId(null);
      setDeactivatingId(null);
    }
  };

  const hasPrivilege = (privilegeName) => {
    return !loadingPrivileges && rolePrivileges.includes(privilegeName);
  };

  const handleActivate = async (id) => {
    setActivatingId(id);
    setActivationError(null);
    try {
      await departmentService.activateDepartment(id);
      fetchDepartments();
    } catch (error) {
      console.error("Error activating department:", error);
      setActivationError(`Failed to activate department with ID ${id}`);
    } finally {
      setActivatingId(null);
    }
  };

  const handleDeactivate = async (id) => {
    setDeactivatingId(id);
    setDeactivationError(null);
    try {
      await departmentService.deactivateDepartment(id);
      fetchDepartments();
    } catch (error) {
      console.error("Error deactivating department:", error);
      setDeactivationError(`Failed to deactivate department with ID ${id}`);
    } finally {
      setDeactivatingId(null);
    }
  };

  const filteredDepartments =
    departments?.filter(
      (department) =>
        department.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        department.description
          ?.toLowerCase()
          .includes(filterText.toLowerCase()) ||
        department.email?.toLowerCase().includes(filterText.toLowerCase()) ||
        department.phone?.includes(filterText.toLowerCase()) ||
        String(department.department_id)
          ?.toLowerCase()
          .includes(filterText.toLowerCase())
    ) || [];

  if (loading || loadingPrivileges) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <HashLoader color="#333" size={60} />
          <p>Loading Departments...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={fetchDepartments}>Retry</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.headerContainer}>
        <div className={styles.card}>
          <h2>Total Departments</h2>
          <p>{departments.length}</p>
        </div>
        {hasPrivilege("AddDepartment") && (
          <button
            className={styles.addButton}
            onClick={() => setAddModalOpen(true)}
          >
            + Add Department
          </button>
        )}
      </div>
      <div className={styles.staffListContainer}>
        <input
          type="text"
          className={styles.searchinput}
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <div className={styles.staffList}>
          {filteredDepartments.map((department) => (
            <div key={department.department_id} className={styles.staffCard}>
              <div className={styles.cardup}>
                <div className={styles.staffLeft}>
                  <div className={styles.staffInfo}>
                    <div className={styles.staffName}>{department.name}</div>
                    <div className={styles.staffEmail}>
                      {department.description}
                    </div>
                  </div>
                </div>
                <div className={styles.staffDetails}>
                  <div className={styles.staffDetail}>
                    <strong>ID:</strong> {department.department_id}
                  </div>
                  <div className={styles.staffDetail}>
                    <strong>Email:</strong> {department.email}
                  </div>
                  <div className={styles.staffDetail}>
                    <strong>Phone:</strong> {department.phone}
                  </div>
                  <div className={styles.staffDetail}>
                    <strong>Status:</strong>{" "}
                    {department.is_active ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
              <div className={styles.staffActions}>
                {hasPrivilege("EditDepartment") && (
                  <FaEdit
                    size={20}
                    onClick={() => {
                      setSelectedDepartment(department);
                      setEditModalOpen(true);
                    }}
                  />
                )}
                {hasPrivilege("DeleteDepartment") && (
                  <FaTrash
                    size={20}
                    className={styles.trash}
                    onClick={() => {
                      setSelectedDepartment(department);
                      setDeleteModalOpen(true);
                    }}
                  />
                )}
              </div>
              <div className={styles.activationButtons}>
                {department.is_active
                  ? hasPrivilege("DeactivateDepartment") && (
                      <button
                        onClick={() =>
                          handleDeactivate(department.department_id)
                        }
                        disabled={deactivatingId === department.department_id}
                        className={styles.deactivateButton}
                      >
                        {deactivatingId === department.department_id
                          ? "Deactivating..."
                          : "Deactivate"}
                      </button>
                    )
                  : hasPrivilege("DeactivateDepartment") && (
                      <button
                        onClick={() => handleActivate(department.department_id)}
                        disabled={activatingId === department.department_id}
                        className={styles.activateButton}
                      >
                        {activatingId === department.department_id
                          ? "Activating..."
                          : "Activate"}
                      </button>
                    )}
                {activationError && (
                  <p className={styles.errorMessage}>{activationError}</p>
                )}
                {deactivationError && (
                  <p className={styles.errorMessage}>{deactivationError}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Department"
      >
        {selectedDepartment && hasPrivilege("EditDepartment") && (
          <EditDepartment
            department={selectedDepartment}
            onClose={() => setEditModalOpen(false)}
            onUpdate={fetchDepartments}
          />
        )}
      </Modal>

      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Department"
      >
        {hasPrivilege("AddDepartment") && (
          <AddDepartment
            onClose={() => setAddModalOpen(false)}
            onAdd={fetchDepartments}
          />
        )}
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        {selectedDepartment && hasPrivilege("DeleteDepartment") && (
          <DeleteDepartment
            department={selectedDepartment}
            onClose={() => setDeleteModalOpen(false)}
            onDelete={fetchDepartments}
          />
        )}
      </Modal>
    </Layout>
  );
};

export default DepartmentList;
