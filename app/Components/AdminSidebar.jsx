"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  FaChevronDown,
  FaChevronUp,
  FaUsers,
  FaBuilding,
  FaSignOutAlt, // Import the sign-out icon
} from "react-icons/fa";
import { FaUserShield } from "react-icons/fa6";

import { FaAward } from "react-icons/fa";
import styles from "./css/sidebar.module.css";
import { useRouter } from "next/navigation"; // Import useRouter
import { useAuth } from "@/Services/authService";
const AdminSidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    staffManagement: false,
    branchManagement: false,
    roleManagement: false,
    privilegeManagement: false,
  });

  const { user, logout } = useAuth() || {}; // Get logout function from AuthContext
  const router = useRouter(); // Initialize useRouter

  const toggleMenu = (menu) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const handleLogout = () => {
    if (logout) {
      logout();
      router.replace("/"); // Use replace to prevent going back to a logged-in state
    }
  };

  return (
    <div className={styles.sidebar}>
      <ul className={styles.menu}>
        <li className={styles.menuItem}>
          <span onClick={() => toggleMenu("staffManagement")}>
            <FaUsers className={styles.menuIcon} />
            Staff Management
            {openMenus.staffManagement ? (
              <FaChevronUp className={styles.chevron} />
            ) : (
              <FaChevronDown className={styles.chevron} />
            )}
          </span>
          {openMenus.staffManagement && (
            <ul className={styles.subMenu}>
              <li>
                <Link href="/Admin/Staff-List">View Staff List</Link>
              </li>
            </ul>
          )}
        </li>
        <li className={styles.menuItem}>
          <span onClick={() => toggleMenu("branchManagement")}>
            <FaBuilding className={styles.menuIcon} />
            Branch Management
            {openMenus.branchManagement ? (
              <FaChevronUp className={styles.chevron} />
            ) : (
              <FaChevronDown className={styles.chevron} />
            )}
          </span>
          {openMenus.branchManagement && (
            <ul className={styles.subMenu}>
              <li>
                <Link href="/Admin/Branch-List">View Branch List</Link>
              </li>
            </ul>
          )}
        </li>
        <li className={styles.menuItem}>
          <span onClick={() => toggleMenu("roleManagement")}>
            <FaUserShield className={styles.menuIcon} />
            Role Management
            {openMenus.roleManagement ? (
              <FaChevronUp className={styles.chevron} />
            ) : (
              <FaChevronDown className={styles.chevron} />
            )}
          </span>
          {openMenus.roleManagement && (
            <ul className={styles.subMenu}>
              <li>
                <Link href="/Admin/Role-List">View Role List</Link>
              </li>
            </ul>
          )}
        </li>
        <li className={styles.menuItem}>
          <span onClick={() => toggleMenu("privilegeManagement")}>
            <FaAward className={styles.menuIcon} />
            Privileges
            {openMenus.privilegeManagement ? (
              <FaChevronUp className={styles.chevron} />
            ) : (
              <FaChevronDown className={styles.chevron} />
            )}
          </span>
          {openMenus.privilegeManagement && (
            <ul className={styles.subMenu}>
              <li>
                <Link href="/Admin/Privilege">View Privilege List</Link>
              </li>
            </ul>
          )}
        </li>

        {user && (
          <li className={styles.lastItem}>
            <span className={styles.logout} onClick={handleLogout}>
              <FaSignOutAlt className={styles.menuIcon} />
              Logout
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default AdminSidebar;
