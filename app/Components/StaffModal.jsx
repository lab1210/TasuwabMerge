"use client";
import React from "react";
import styles from "./css/StaffModal.module.css"; // Import CSS Modules

const StaffModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className={styles.title}>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default StaffModal;