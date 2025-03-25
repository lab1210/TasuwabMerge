"use client";

import React, { useState, useEffect } from "react";
import styles from "../../Components/css/Admin.module.css";
import Layout from "@/app/Components/Layout";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "@/app/Components/Modal";
import AddBranch from "./Add/page";
import DeleteBranch from "./Delete/page";
import EditBranch from "./Edit/page";
import branchService from "@/Services/branchService";
import { HashLoader } from "react-spinners";
import { useAuth } from "@/Services/authService"; // Import useAuth
import axios from "axios";

const BranchList = () => {
  const [filterText, setFilterText] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]);
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
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await branchService.getAllBranches();
      if (response?.data && Array.isArray(response.data)) {
        setBranches(response.data);
      } else if (Array.isArray(response)) {
        setBranches(response);
      } else {
        console.warn("Unexpected branch data format:", response);
        setError("Failed to load branches: Data format incorrect.");
        setBranches([]);
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error);
      setError("Failed to load branches.");
      setBranches([]);
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
      await branchService.activateBranch(id);
      fetchBranches();
    } catch (error) {
      console.error("Error activating branch:", error);
      setActivationError(`Failed to activate branch with ID ${id}`);
    } finally {
      setActivatingId(null);
    }
  };

  const handleDeactivate = async (id) => {
    setDeactivatingId(id);
    setDeactivationError(null);
    try {
      await branchService.deactivateBranch(id);
      fetchBranches();
    } catch (error) {
      console.error("Error deactivating branch:", error);
      setDeactivationError(`Failed to deactivate branch with ID ${id}`);
    } finally {
      setDeactivatingId(null);
    }
  };

  const filteredBranch =
    branches?.filter(
      (branch) =>
        branch.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        branch.description?.toLowerCase().includes(filterText.toLowerCase()) ||
        branch.email?.toLowerCase().includes(filterText.toLowerCase()) ||
        branch.phone?.includes(filterText.toLowerCase()) ||
        String(branch.branch_id)
          ?.toLowerCase()
          .includes(filterText.toLowerCase())
    ) || [];

  if (loading || loadingPrivileges) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <HashLoader color="#333" size={60} />
          <p>Loading Branches...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={fetchBranches}>Retry</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.headerContainer}>
        <div className={styles.card}>
          <h2>Total Branches</h2>
          <p>{branches.length}</p>
        </div>
        {hasPrivilege("AddBranch") && (
          <button
            className={styles.addButton}
            onClick={() => setAddModalOpen(true)}
          >
            + Add Branch
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
          {filteredBranch.map((branch) => (
            <div key={branch.branch_id} className={styles.staffCard}>
              <div className={styles.cardup}>
                <div className={styles.staffLeft}>
                  <div className={styles.staffInfo}>
                    <div className={styles.staffName}>{branch.name}</div>
                    <div className={styles.staffEmail}>
                      {branch.description}
                    </div>
                  </div>
                </div>
                <div className={styles.staffDetails}>
                  <div className={styles.staffDetail}>
                    <strong>ID:</strong> {branch.branch_id}
                  </div>
                  <div className={styles.staffDetail}>
                    <strong>Email:</strong> {branch.email}
                  </div>
                  <div className={styles.staffDetail}>
                    <strong>Phone:</strong> {branch.phone}
                  </div>
                  <div className={styles.staffDetail}>
                    <strong>Status:</strong>{" "}
                    {branch.is_active ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
              <div className={styles.staffActions}>
                {hasPrivilege("EditBranch") && (
                  <FaEdit
                    size={20}
                    onClick={() => {
                      setSelectedBranch(branch);
                      setEditModalOpen(true);
                    }}
                  />
                )}
                {hasPrivilege("DeleteBranch") && (
                  <FaTrash
                    size={20}
                    className={styles.trash}
                    onClick={() => {
                      setSelectedBranch(branch);
                      setDeleteModalOpen(true);
                    }}
                  />
                )}
              </div>
              <div className={styles.activationButtons}>
                {branch.is_active
                  ? hasPrivilege("DeactivateBranch") && (
                      <button
                        onClick={() => handleDeactivate(branch.branch_id)}
                        disabled={deactivatingId === branch.branch_id}
                        className={styles.deactivateButton}
                      >
                        {deactivatingId === branch.branch_id
                          ? "Deactivating..."
                          : "Deactivate"}
                      </button>
                    )
                  : hasPrivilege("DeactivateBranch") && (
                      <button
                        onClick={() => handleActivate(branch.branch_id)}
                        disabled={activatingId === branch.branch_id}
                        className={styles.activateButton}
                      >
                        {activatingId === branch.branch_id
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
        title="Edit Branch"
      >
        {selectedBranch && hasPrivilege("EditBranch") && (
          <EditBranch
            branch={selectedBranch}
            onClose={() => setEditModalOpen(false)}
            onUpdate={fetchBranches}
          />
        )}
      </Modal>

      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Branch"
      >
        {hasPrivilege("AddBranch") && (
          <AddBranch
            onClose={() => setAddModalOpen(false)}
            onAdd={fetchBranches}
          />
        )}
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        {selectedBranch && hasPrivilege("DeleteBranch") && (
          <DeleteBranch
            branch={selectedBranch}
            onClose={() => setDeleteModalOpen(false)}
            onDelete={fetchBranches}
          />
        )}
      </Modal>
    </Layout>
  );
};

export default BranchList;
