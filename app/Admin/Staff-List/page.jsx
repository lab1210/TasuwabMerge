"use client";
import React, { useEffect, useState } from "react";
import styles from "../../Components/css/Admin.module.css"; // Create a new CSS module
import Layout from "@/app/Components/Layout";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import ellipsis icon
import Modal from "@/app/Components/Modal";
import EditStaff from "./Edit/page";
import AddStaff from "./Add/page";
import DeleteStaff from "./Delete/page";
import staffService from "@/Services/staffService";
import { HashLoader } from "react-spinners"; // Import spinner for loading state

const StaffList = () => {
  const [filterText, setFilterText] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staff, setStaff] = useState([]); // ✅ Initialize with empty array
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState(null); // Add an error state

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.getStaffs();
      console.log("Staff API Response:", response); // Log response

      if (Array.isArray(response)) {
        setStaff(response); // ✅ Correctly set staff data
      } else {
        console.warn("Unexpected staff data format:", response);
        setError("Failed to load staff list: Data format incorrect.");
      }
    } catch (error) {
      console.error("Error fetching staff list", error);
      setError("Failed to load staff list.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffCode) => {
    try {
      await staffService.deleteStaff(staffCode);
      setStaff(staff.filter((s) => s.staffCode !== staffCode));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting staff", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <HashLoader color="#333" size={60} />
          <p>Loading Staff List...</p>
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
          <p>{staff.length}</p> {/* ✅ staff is always an array */}
        </div>
        <button
          className={styles.addButton}
          onClick={() => setAddModalOpen(true)}
        >
          + Add Staff
        </button>
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
          {staff
            .filter((s) =>
              `${s.firstName} ${s.lastName}`
                .toLowerCase()
                .includes(filterText.toLowerCase())
            )
            .map((s) => (
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
                        {s.firstName} {s.lastName}{" "}
                        {/* ✅ Fixed unnecessary {""} */}
                      </div>
                    </div>
                  </div>
                  <div className={styles.staffDetails}>
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
                  <FaEdit
                    size={20}
                    onClick={() => {
                      setSelectedStaff(s);
                      setEditModalOpen(true);
                    }}
                  />
                  <FaTrash
                    size={20}
                    className={styles.trash}
                    onClick={() => {
                      setSelectedStaff(s);
                      setDeleteModalOpen(true);
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Staff"
      >
        {selectedStaff && (
          <EditStaff
            staff={selectedStaff}
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
        <AddStaff
          onClose={() => setAddModalOpen(false)}
          onSuccess={fetchStaff}
        />
      </Modal>
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        {selectedStaff && (
          <DeleteStaff
            staff={selectedStaff}
            onClose={() => setDeleteModalOpen(false)}
            onDelete={handleDeleteStaff}
          />
        )}
      </Modal>
    </Layout>
  );
};

export default StaffList;
