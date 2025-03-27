"use client";

import React, { useState, useEffect } from "react";
import styles from "../../Components/css/Admin.module.css";
import Layout from "@/app/Components/Layout";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Modal from "@/app/Components/Modal";
import AddStaff from "./Add/page";
import DeleteStaff from "./Delete/page";
import EditStaff from "./Edit/page";
import staffService from "@/Services/staffService";
import { HashLoader } from "react-spinners";
import { useAuth } from "@/Services/authService"; // Import useAuth
import axios from "axios";

const StaffList = () => {
  const [filterText, setFilterText] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [rolePrivileges, setRolePrivileges] = useState([]);
  const [loadingPrivileges, setLoadingPrivileges] = useState(true);
  const [expandedStaffId, setExpandedStaffId] = useState(null);
  const [detailedStaff, setDetailedStaff] = useState({});
  const [loadingDetailedStaff, setLoadingDetailedStaff] = useState(null);
  const [errorDetailedStaff, setErrorDetailedStaff] = useState(null);

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
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.getStaffs();
      if (response && Array.isArray(response)) {
        setStaff(response);
      } else if (Array.isArray(response)) {
        setStaff(response);
      } else {
        console.warn("Unexpected staff data format:", response);
        setError("Failed to load staff: Data format incorrect.");
        setStaff([]);
      }
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      setError("Failed to load staff.");
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedStaff = async (staffCode) => {
    setLoadingDetailedStaff(staffCode);
    setErrorDetailedStaff(null);
    try {
      const response = await staffService.getStaff(staffCode);
      if (response?.success && response?.staff && response?.user) {
        setDetailedStaff((prev) => ({ ...prev, [staffCode]: response }));
      } else {
        console.warn("Unexpected detailed staff data:", response);
        setErrorDetailedStaff("Failed to load detailed staff information.");
      }
    } catch (error) {
      console.error(`Error fetching details for ${staffCode}:`, error);
      setErrorDetailedStaff(`Failed to load details for ${staffCode}`);
    } finally {
      setLoadingDetailedStaff(null);
    }
  };

  const hasPrivilege = (privilegeName) => {
    return !loadingPrivileges && rolePrivileges.includes(privilegeName);
  };

  const toggleDetails = (staffCode) => {
    setExpandedStaffId((prevId) => (prevId === staffCode ? null : staffCode));
    if (expandedStaffId !== staffCode && !detailedStaff[staffCode]) {
      fetchDetailedStaff(staffCode);
    }
  };

  const isExpanded = (staffCode) => expandedStaffId === staffCode;

  const filteredStaff =
    staff?.filter(
      (s) =>
        `${s.firstName} ${s.lastName}`
          .toLowerCase()
          .includes(filterText.toLowerCase()) ||
        s.staffCode?.toLowerCase().includes(filterText.toLowerCase()) ||
        s.email?.toLowerCase().includes(filterText.toLowerCase()) ||
        s.phone?.includes(filterText.toLowerCase())
    ) || [];

  const formatDate = (date) => {
    if (!date) return "";
    const year = Math.floor(date / 10000);
    const month = Math.floor((date % 10000) / 100);
    const day = date % 100;
    return `${year}-${month < 10 ? "0" + month : month}-${
      day < 10 ? "0" + day : day
    }`;
  };

  if (loading || loadingPrivileges) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <HashLoader color="#333" size={60} />
          <p>Loading Staff...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={fetchStaff}>Retry</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.headerContainer}>
        <div className={styles.card}>
          <h2>Total Staff</h2>
          <p>{staff.length}</p>
        </div>
        {hasPrivilege("CreateStaff") && (
          <button
            className={styles.addButton}
            onClick={() => setAddModalOpen(true)}
          >
            + Add Staff
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
          {filteredStaff.map((s) => (
            <div key={s.staffCode} className={styles.staffCard}>
              <div className={styles.cardup}>
                <div className={styles.staffLeft}>
                  <div className={styles.staffProfile}>
                    <img
                      src="/image.png"
                      alt="Profile"
                      className={styles.profileImage}
                    />
                  </div>
                  <div className={styles.staffInfo}>
                    <div className={styles.staffName}>
                      {s.firstName} {s.lastName}
                    </div>
                    <div className={styles.staffEmail}>{s.email}</div>
                  </div>
                </div>
                <div className={styles.staffDetails}>
                  <div className={styles.staffDetail}>
                    <strong>Code:</strong> {s.staffCode}
                  </div>
                  <div className={styles.staffDetail}>
                    <strong>Branch:</strong> {s.branchID}
                  </div>
                  <div className={styles.staffDetail}>
                    <strong>Department:</strong> {s.departmentID}
                  </div>
                  <div className={styles.staffDetail}>
                    <strong>Position:</strong> {s.positionID}
                  </div>
                  <div className={styles.staffDetail}>
                    <strong>Role:</strong> {s.roleID}
                  </div>
                </div>
              </div>
              <div className={styles.staffActions}>
                <button
                  className={styles.viewPrivilegesButton}
                  onClick={() => toggleDetails(s.staffCode)}
                >
                  Details{" "}
                  {isExpanded(s.staffCode) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </button>
                {hasPrivilege("UpdateStaff") && (
                  <FaEdit
                    size={20}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStaff(s);
                      setEditModalOpen(true);
                    }}
                  />
                )}
                {hasPrivilege("DeleteStaff") && (
                  <FaTrash
                    size={20}
                    className={styles.trash}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStaff(s);
                      setDeleteModalOpen(true);
                    }}
                  />
                )}
              </div>
              {isExpanded(s.staffCode) &&
                detailedStaff[s.staffCode]?.staff &&
                detailedStaff[s.staffCode]?.user && (
                  <div className={styles.expandedDetails}>
                    {loadingDetailedStaff === s.staffCode ? (
                      <div className={styles.loadingContainer}>
                        <HashLoader color="#555" size={30} />
                        <p>Loading Details...</p>
                      </div>
                    ) : errorDetailedStaff ? (
                      <p className={styles.errorMessage}>
                        {errorDetailedStaff}
                      </p>
                    ) : (
                      <>
                        <div className={styles.staffDetail}>
                          <strong>Gender:</strong>{" "}
                          {detailedStaff[s.staffCode].staff.gender}
                        </div>
                        <div className={styles.staffDetail}>
                          <strong>Marital Status:</strong>{" "}
                          {detailedStaff[s.staffCode].staff.martialStatus}
                        </div>
                        <div className={styles.staffDetail}>
                          <strong>Date of Birth:</strong>{" "}
                          {formatDate(
                            detailedStaff[s.staffCode].staff.dateOfBirth
                          )}
                        </div>
                        <div className={styles.staffDetail}>
                          <strong>Address:</strong>{" "}
                          {detailedStaff[s.staffCode].staff.address}
                        </div>
                        <div className={styles.staffDetail}>
                          <strong>Phone:</strong>{" "}
                          {detailedStaff[s.staffCode].staff.phone}
                        </div>
                        <div className={styles.staffDetail}>
                          <strong>Email:</strong>{" "}
                          {detailedStaff[s.staffCode].staff.email}
                        </div>
                        <div className={styles.staffDetail}>
                          <strong>Staff Code:</strong>{" "}
                          {detailedStaff[s.staffCode].user.staffCode}
                        </div>
                        <div className={styles.staffDetail}>
                          <strong>User Email:</strong>{" "}
                          {detailedStaff[s.staffCode].user.email}
                        </div>
                        <div className={styles.staffDetail}>
                          <strong>Role Code:</strong>{" "}
                          {detailedStaff[s.staffCode].user.roleCode}
                        </div>
                        <div className={styles.staffDetail}>
                          <strong>Position Code:</strong>{" "}
                          {detailedStaff[s.staffCode].user.positionCode}
                        </div>
                        <div className={styles.staffDetail}>
                          <strong>Department Code:</strong>{" "}
                          {detailedStaff[s.staffCode].user.departmentCode}
                        </div>
                        <div className={styles.staffDetail}>
                          <strong>Branch Code:</strong>{" "}
                          {detailedStaff[s.staffCode].user.branchCode}
                        </div>
                        <div className={styles.staffDetail}>
                          <strong>Active:</strong>{" "}
                          {detailedStaff[s.staffCode].user.isActive
                            ? "Yes"
                            : "No"}
                        </div>
                        <div className={styles.staffDetail}>
                          <strong>Password Set:</strong>{" "}
                          {detailedStaff[s.staffCode].user.isPasswordSet
                            ? "Yes"
                            : "No"}
                        </div>
                        {/* You can display other properties from detailedStaff[s.staffCode].staff and .user here */}
                      </>
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Staff"
      >
        {selectedStaff && hasPrivilege("EditStaff") && (
          <EditStaff
            staffCode={selectedStaff.staffCode}
            onClose={() => setEditModalOpen(false)}
            onUpdate={fetchStaff}
          />
        )}
      </Modal>

      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Staff"
      >
        {hasPrivilege("AddStaff") && (
          <AddStaff onClose={() => setAddModalOpen(false)} onAdd={fetchStaff} />
        )}
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        {selectedStaff && hasPrivilege("DeleteStaff") && (
          <DeleteStaff
            staff={selectedStaff}
            onClose={() => setDeleteModalOpen(false)}
            onDelete={fetchStaff}
          />
        )}
      </Modal>
    </Layout>
  );
};

export default StaffList;
