"use client";
import React from "react";
import styles from "./css/Modal.module.css"; // Create styles for modal
import { IoIosClose } from "react-icons/io";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.close}>
          <IoIosClose size={40} onClick={onClose} />
        </div>
        <div>
          <div className={styles.title}>
            <h1>{title}</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
