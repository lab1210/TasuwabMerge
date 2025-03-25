"use client";
import Layout from "@/app/Components/Layout";
import React, { useEffect, useState } from "react";
import styles from "../../Components/css/NotificationActivity.module.css";
import dummy from "../../Components/data/NotificationData";
import NotificationItem from "@/app/Components/NotificationItem";
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      setNotifications(dummy);
    };

    fetchNotifications();
  });

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };
  return (
    <Layout>
      <div className={styles.container}>
        <ul className={styles.notificationList}>
          {notifications.map((notification) => {
            return (
              <NotificationItem
                key={notification.id}
                notification={notification}
                markAsRead={markAsRead}
              />
            );
          })}
        </ul>
      </div>
    </Layout>
  );
};

export default Notifications;
