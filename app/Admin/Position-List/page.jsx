"use client";

import React, { useState, useEffect } from "react";
import styles from "../../Components/css/Admin.module.css";
import Layout from "@/app/Components/Layout";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "@/app/Components/Modal";
import positionService from "@/Services/positionService";
import { HashLoader } from "react-spinners";
import AddPosition from "./AddPosition/page";
import EditPosition from "./EditPosition/page";
import DeletePosition from "./DeletePosition/page";
import { useAuth } from "@/Services/authService"; // Import useAuth
import axios from "axios";

const PositionList = () => {
  const [filterText, setFilterText] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await positionService.getAllPositions();
      if (response?.data && Array.isArray(response.data)) {
        setPositions(response.data);
      } else if (Array.isArray(response)) {
        setPositions(response);
      } else {
        console.warn("Unexpected position data format:", response);
        setError("Failed to load positions: Data format incorrect.");
        setPositions([]);
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
      setError("Failed to load positions.");
      setPositions([]);
    } finally {
      setLoading(false);
    }
  };

  const hasPrivilege = (privilegeName) => {
    return !loadingPrivileges && rolePrivileges.includes(privilegeName);
  };

  const filteredPositions =
    positions?.filter(
      (position) =>
        position.name?.toLowerCase().includes(filterText.toLowerCase()) ||
        position.description
          ?.toLowerCase()
          .includes(filterText.toLowerCase()) ||
        String(position.position_id)
          ?.toLowerCase()
          .includes(filterText.toLowerCase())
    ) || [];

  if (loading || loadingPrivileges) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <HashLoader color="#333" size={60} />
          <p>Loading Positions...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={fetchPositions}>Retry</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.headerContainer}>
        <div className={styles.card}>
          <h2>Total Positions</h2>
          <p>{positions.length}</p>
        </div>
        {hasPrivilege("AddPosition") && (
          <button
            className={styles.addButton}
            onClick={() => setAddModalOpen(true)}
          >
            + Add Position
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
          {filteredPositions.map((position) => (
            <div key={position.position_id} className={styles.staffCard}>
              <div className={styles.cardup}>
                <div className={styles.staffLeft}>
                  <div className={styles.staffInfo}>
                    <div className={styles.staffName}>{position.name}</div>
                    <div className={styles.staffEmail}>
                      {position.description}
                    </div>
                  </div>
                </div>
                <div className={styles.staffDetails}>
                  <div className={styles.staffDetail}>
                    <strong>ID:</strong> {position.position_id}
                  </div>
                </div>
              </div>
              <div className={styles.staffActions}>
                {hasPrivilege("EditPosition") && (
                  <FaEdit
                    size={20}
                    onClick={() => {
                      setSelectedPosition(position);
                      setEditModalOpen(true);
                    }}
                  />
                )}
                {hasPrivilege("DeletePosition") && (
                  <FaTrash
                    size={20}
                    className={styles.trash}
                    onClick={() => {
                      setSelectedPosition(position);
                      setDeleteModalOpen(true);
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Position"
      >
        {hasPrivilege("AddPosition") && (
          <AddPosition
            onClose={() => setAddModalOpen(false)}
            onAdd={fetchPositions}
          />
        )}
      </Modal>

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Position"
      >
        {selectedPosition && hasPrivilege("EditPosition") && (
          <EditPosition
            position={selectedPosition}
            onClose={() => setEditModalOpen(false)}
            onUpdate={fetchPositions}
          />
        )}
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        {selectedPosition && hasPrivilege("DeletePosition") && (
          <DeletePosition
            position={selectedPosition}
            onClose={() => setDeleteModalOpen(false)}
            onDelete={fetchPositions}
          />
        )}
      </Modal>
    </Layout>
  );
};

export default PositionList;
