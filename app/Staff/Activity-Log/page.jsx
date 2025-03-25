"use client";
import React, { useState, useEffect } from "react";
import Layout from "@/app/Components/Layout";
import styles from "../../Components/css/NotificationActivity.module.css"; // Assuming shared styles
import dummyActivity from "../../Components/data/activityData"; // Import dummy data
import ActivityItem from "@/app/Components/ActivityItem";

const ActivityLog = () => {
  const [activityLog, setActivityLog] = useState([]);

  useEffect(() => {
    const fetchActivityLog = async () => {
      setActivityLog(dummyActivity);
    };

    fetchActivityLog();
  }, []); // Empty dependency array for initial load

  return (
    <Layout>
      <div className={styles.container}>
        <ul className={styles.notificationList}>
          {activityLog.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default ActivityLog;
