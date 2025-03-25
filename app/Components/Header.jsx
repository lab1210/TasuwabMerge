"use client";
import React from "react";
import styles from "./css/Header.module.css";
import { GoSidebarExpand } from "react-icons/go";
import { GoSidebarCollapse } from "react-icons/go";
import { RxActivityLog } from "react-icons/rx";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LuCircleUser } from "react-icons/lu";
import Breadcrumbs from "./Breadcrumbs";
import Link from "next/link";
import { useAuth } from "@/Services/authService";
import { useState, useEffect } from "react"; // Import useState and useEffect
import axios from "axios";

const Header = ({ isSidebarOpen, onToggleSidebar }) => {
  const { user } = useAuth();
  const [roleName, setRoleName] = useState(null);
  const userNameCaps = user?.firstName?.toUpperCase() || "";

  useEffect(() => {
    const fetchRoleName = async () => {
      if (user?.role) {
        try {
          const allRolesResponse = await axios.get(
            "https://localhost:65396/api/Role/all" // Your roles API endpoint
          );
          const allRoles = allRolesResponse.data;
          const foundRole = allRoles.find((r) => r.role_id === user.role);
          setRoleName(foundRole?.name || null); // Set the role name
        } catch (error) {
          console.error("Error fetching roles:", error);
        }
      }
    };

    fetchRoleName();
  }, [user?.role]); // Re-run effect when user?.role changes

  const basePath = () => {
    if (roleName === "ADMIN") {
      return "Admin";
    }
    return "Staff"; // Default for other roles or if roleName is not fetched
  };

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <div className={styles.toggleBtn} onClick={onToggleSidebar}>
          {isSidebarOpen ? (
            <GoSidebarExpand size={30} />
          ) : (
            <GoSidebarCollapse size={30} />
          )}
        </div>
        <img src="/logo.png" alt="logo" className={styles.logo} />
        <div className={styles.breadcrumbsWrapper}>
          <Breadcrumbs />
        </div>
      </div>
      <div className={styles.headerIcons}>
        <div className={styles.welcome}>
          Welcome, <span>{userNameCaps}</span>
        </div>
        <div className={styles.toggleBtn}>
          <Link href={`/${basePath()}/Profile`}>
            <LuCircleUser size={24} />
          </Link>
        </div>
        <div className={styles.toggleBtn}>
          <Link href={`/${basePath()}/Activity-Log`}>
            <RxActivityLog size={24} />
          </Link>
        </div>
        <div className={styles.toggleBtn}>
          <Link href={`/${basePath()}/Notifications`}>
            <IoIosNotificationsOutline size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
