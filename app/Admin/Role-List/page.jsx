"use client";

import React, { useState, useEffect } from "react";
import styles from "../../Components/css/Admin.module.css";
import Layout from "@/app/Components/Layout";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Modal from "@/app/Components/Modal";
import AddRole from "./Add/page";
import EditRole from "./Edit/page";
import DeleteRole from "./Delete/page";
import roleService from "@/Services/RoleService";
import { HashLoader } from "react-spinners";
import { useAuth } from "@/Services/authService"; // Import useAuth
import axios from "axios";

const RoleList = () => {
  const [filterText, setFilterText] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRoleId, setExpandedRoleId] = useState(null);
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
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await roleService.getAllRoles();
      if (response?.data && Array.isArray(response.data)) {
        setRoles(response.data);
      } else if (Array.isArray(response)) {
        setRoles(response);
      } else {
        console.warn("Unexpected role data format:", response);
        setError("Failed to load roles: Data format incorrect.");
        setRoles([]);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setError("Failed to load roles.");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const hasPrivilege = (privilegeName) => {
    return !loadingPrivileges && rolePrivileges.includes(privilegeName);
  };

  const togglePrivileges = (roleId) => {
    setExpandedRoleId((prevId) => (prevId === roleId ? null : roleId));
  };

  const isExpanded = (roleId) => expandedRoleId === roleId;

  const filteredRoles =
    roles?.filter(
      (role) =>
        role.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        role.description?.toLowerCase().includes(filterText.toLowerCase()) ||
        role.role_id?.toLowerCase().includes(filterText.toLowerCase())
    ) || [];

  if (loading || loadingPrivileges) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <HashLoader color="#333" size={60} />
          <p>Loading Roles...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={fetchRoles}>Retry</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.headerContainer}>
        <div className={styles.card}>
          <h2>Total Roles</h2>
          <p>{roles.length}</p>
        </div>
        {hasPrivilege("CreateRole") && (
          <button
            className={styles.addButton}
            onClick={() => setAddModalOpen(true)}
          >
            + Add Role
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
          {filteredRoles.map((role) => (
            <div key={role.role_id} className={styles.staffCard}>
              <div className={styles.cardup}>
                <div className={styles.staffLeft}>
                  <div className={styles.staffInfo}>
                    <div className={styles.staffName}>{role.name}</div>
                    <div className={styles.staffEmail}>{role.description}</div>
                  </div>
                </div>
                <div className={styles.staffDetails}>
                  <div className={styles.staffDetail}>
                    <strong>ID:</strong> {role.role_id}
                  </div>
                </div>
              </div>
              <div className={styles.staffActions}>
                <button
                  className={styles.viewPrivilegesButton}
                  onClick={() => togglePrivileges(role.role_id)}
                >
                  Privileges{" "}
                  {isExpanded(role.role_id) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </button>
                {hasPrivilege("UpdateRole") && (
                  <FaEdit
                    size={20}
                    onClick={() => {
                      setSelectedRole(role);
                      setEditModalOpen(true);
                    }}
                  />
                )}
                {hasPrivilege("DeleteRole") && (
                  <FaTrash
                    size={20}
                    className={styles.trash}
                    onClick={() => {
                      setSelectedRole(role);
                      setDeleteModalOpen(true);
                    }}
                  />
                )}
              </div>
              {isExpanded(role.role_id) && role.privileges && (
                <div className={styles.expandedPrivileges}>
                  <strong>Privileges:</strong>
                  <ul>
                    {role.privileges.map((privilege) => (
                      <li key={privilege.privilegeId}>
                        {privilege.name || "Unknown Privilege"}
                      </li>
                    ))}
                    {role.privileges.length === 0 && (
                      <li>No privileges assigned to this role.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Role"
      >
        {hasPrivilege("CreateRole") && (
          <AddRole onClose={() => setAddModalOpen(false)} onAdd={fetchRoles} />
        )}
      </Modal>

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Role"
      >
        {selectedRole && hasPrivilege("UpdateRole") && (
          <EditRole
            role={selectedRole}
            onClose={() => setEditModalOpen(false)}
            onUpdate={fetchRoles}
          />
        )}
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        {selectedRole && hasPrivilege("DeleteRole") && (
          <DeleteRole
            role={selectedRole}
            onClose={() => setDeleteModalOpen(false)}
            onDelete={fetchRoles}
          />
        )}
      </Modal>
    </Layout>
  );
};

export default RoleList;
