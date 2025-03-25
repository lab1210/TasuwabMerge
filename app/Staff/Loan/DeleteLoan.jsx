"use client";
import StaffModal from "@/app/Components/StaffModal";
import { useState } from "react";
import styles from "../../Components/css/StaffModal.module.css";
import { Button } from "@mui/material";

const DeleteLoan = ({ isOpen, onClose, loan, onDelete }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDelete = () => {
    setIsConfirming(true);
  };

  const handleConfirmDelete = () => {
    onDelete(loan.LoanApplication.id); // Assuming 'id' is in loan.LoanApplication
    onClose();
  };

  const handleCancelDelete = () => {
    setIsConfirming(false);
    onClose();
  };

  if (!isOpen || !loan) return null;

  return (
    <StaffModal isOpen={isOpen} onClose={onClose} title="Delete Loan">
      {isConfirming ? (
        <div className={styles.confirm}>
          <p>
            Are you sure you want to delete Loan ID:
            <br />
            <span>{loan.LoanApplication.id}</span>
          </p>
          <div className={styles.confirmBtn}>
            <button onClick={handleConfirmDelete}>Yes</button>
            <button onClick={handleCancelDelete}>No</button>
          </div>
        </div>
      ) : (
        <div className={styles.confirm}>
          <p>
            Are you sure you want to delete this loan?
            <br />
            <span>This action cannot be undone.</span>
          </p>
          <div className={styles.confirmBtn}>
            <Button
              onClick={handleDelete}
              variant="contained"
              style={{ backgroundColor: "#ff4d4d" }}
            >
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </div>
      )}
    </StaffModal>
  );
};

export default DeleteLoan;