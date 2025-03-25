import React from "react";
import styles from "../Components/css/Activity.module.css"; // Import your CSS module
import {
  FaInfoCircle,
  FaUser,
  FaFileAlt,
  FaCheck,
  FaExclamationTriangle,
  FaTimesCircle,
  FaCog,
  FaMoneyBillAlt,
} from "react-icons/fa"; // Import necessary icons from React Icons

const ActivityItem = ({ activity }) => {
  const { id, type, message, timestamp } = activity;

  const formattedTime = timestamp.toLocaleString();
  const timeAgo = formattedTime; // Replace with actual time difference calculation

  const getIcon = () => {
    switch (type) {
      case "userLogin":
        return <FaUser className={styles.activityIcon} />;
      case "documentUploaded":
        return <FaFileAlt className={styles.activityIcon} />;
      case "paymentReceived":
        return <FaMoneyBillAlt className={styles.activityIcon} />;
      case "settingsUpdated":
        return <FaCog className={styles.activityIcon} />;
      case "activity":
        return <FaInfoCircle className={styles.activityIcon} />;
      case "success":
        return <FaCheck className={styles.activityIcon} />;
      case "warning":
        return <FaExclamationTriangle className={styles.activityIcon} />;
      case "error":
        return <FaTimesCircle className={styles.activityIcon} />;
      default:
        return <FaInfoCircle className={styles.activityIcon} />; // Default icon
    }
  };

  return (
    <div className={styles.activityItem}>
      <div className={styles.icon}>{getIcon()}</div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.message}>{message}</span>
          <span className={styles.time}>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
