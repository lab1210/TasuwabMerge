// NotificationItem.jsx
"use client";
import React from "react";
import styles from "../Components/css/NotificationActivity.module.css"; // Assuming you have Notifications.module.css
import {
  FaCheckCircle,
  FaMoneyBillWave,
  FaClock,
  FaMoneyBillAlt,
  FaHourglassHalf,
  FaTimesCircle,
  FaExclamationTriangle,
  FaUser,
  FaFileAlt,
  FaEdit,
} from "react-icons/fa"; // Import React Icons

const NotificationItem = ({ notification, markAsRead }) => {
  const { id, type, message, timestamp, isRead } = notification;

  const handleMarkAsRead = (e) => {
    e.preventDefault();
    markAsRead(id);
  };

  const timeAgo = "5h ago"; // Replace with actual time difference calculation

  const getIcon = () => {
    switch (type) {
      case "loanApproval":
        return <FaCheckCircle className={styles.Icon} />;
      case "loanDisbursement":
        return <FaMoneyBillWave className={styles.Icon} />;
      case "loanRepaymentDue":
        return <FaClock className={styles.Icon} />;
      case "loanRepaymentReceived":
        return <FaMoneyBillAlt className={styles.Icon} />;
      case "loanApplicationPending":
        return <FaHourglassHalf className={styles.Icon} />;
      case "loanApplicationRejected":
        return <FaTimesCircle className={styles.Icon} />;
      case "loanOverdue":
        return <FaExclamationTriangle className={styles.Icon} />;
      case "userAccountCreated":
        return <FaUser className={styles.Icon} />;
      case "loanDocumentUpload":
        return <FaFileAlt className={styles.Icon} />;
      case "loanTermsChanged":
        return <FaEdit className={styles.Icon} />;
      default:
        return null;
    }
  };

  return (
    <div className={`${styles.notificationCard} ${isRead ? styles.read : ""}`}>
      <div className={styles.notificationIcon}>{getIcon()}</div>
      <div className={styles.notificationContent}>
        <div className={styles.notificationHeader}>
          <span className={styles.notificationTitle}>
            {message.split(".")[0]}.
          </span>{" "}
          {/* Extract title from message */}
          <span className={styles.notificationTime}>{timeAgo}</span>
        </div>
        <p className={styles.notificationText}>{message}</p>
      </div>
      {!isRead && (
        <button className={styles.markReadButton} onClick={handleMarkAsRead}>
          Mark as Read
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
