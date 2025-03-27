"use client";
import React, { useEffect, useState } from "react";
import StaffSidebar from "./StaffSidebar";
import styles from "./css/Layout.module.css";
import Header from "./Header";
import { useAuth } from "@/Services/authService";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth(); // Access userName and userRole from the context

  console.log("User:", user); // Log to check values

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarState");
    if (savedState !== null) {
      setIsSidebarOpen(JSON.parse(savedState));
    }
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      localStorage.setItem("sidebarState", JSON.stringify(!prev));
      return !prev;
    });
  };
  return (
    <div className={styles.layout}>
      <Header
        onToggleSidebar={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <div className={styles.main}>
        {isSidebarOpen && (
          <div className={styles.sidebar}>
            <StaffSidebar />
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
