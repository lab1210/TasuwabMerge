"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaMoneyBill,
  FaChartBar,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUsers, // Staff Management
  FaBuilding, // Branch Management
  FaUserTag, // Role Management
  FaBriefcase, // Position Management
  FaSitemap, // Department Management
} from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import styles from "./css/sidebar.module.css";
import { useAuth } from "@/Services/authService";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HashLoader } from "react-spinners"; // Import the spinner component

const StaffSidebar = () => {
  const { user, loading: authLoading, logout } = useAuth(); // Get logout as well
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([]);
  const [openMenus, setOpenMenus] = useState({});
  const [rolePrivileges, setRolePrivileges] = useState([]);
  const [loadingPrivileges, setLoadingPrivileges] = useState(false); // Initialize to false

  useEffect(() => {
    const fetchPrivileges = async () => {
      if (user?.role) {
        setLoadingPrivileges(true);
        try {
          const allRolesResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/Role/all`
          );
          const allRoles = allRolesResponse.data;
          const foundRole = allRoles.find((r) => r.role_id === user.role);
          setRolePrivileges(foundRole?.privileges?.map((p) => p.name) || []);
        } catch (error) {
          console.error("Error fetching roles:", error);
          setRolePrivileges([]);
        } finally {
          setLoadingPrivileges(false);
        }
      } else {
        setRolePrivileges([]);
        setLoadingPrivileges(false);
      }
    };

    fetchPrivileges();
  }, [user?.role]);

  useEffect(() => {
    if (!loadingPrivileges && rolePrivileges.length > 0) {
      const allMenuItems = [
        {
          key: "branchManagement",
          label: "Branch ",
          icon: <FaBuilding className={styles.menuIcon} />,
          subItems: [
            {
              label: "View Branch List",
              href: "/Admin/Branch-List",
              privilege: "ViewAllBranches",
            },
          ],
          privilege: "ViewAllBranches",
        },
        {
          key: "roleManagement",
          label: "Role ",
          icon: <FaUserTag className={styles.menuIcon} />,
          subItems: [
            {
              label: "View Roles",
              href: "/Admin/Role-List",
              privilege: "ViewRoles",
            },
          ],
          privilege: "ViewRoles",
        },
        {
          key: "positionManagement",
          label: "Position ",
          icon: <FaBriefcase className={styles.menuIcon} />,
          subItems: [
            {
              label: "View Positions",
              href: "/Admin/Position-List",
              privilege: "ViewAllPositions",
            },
          ],
          privilege: "ViewAllPositions",
        },
        {
          key: "departmentManagement",
          label: "Department ",
          icon: <FaSitemap className={styles.menuIcon} />,
          subItems: [
            {
              label: "View Departments",
              href: "/Admin/Departments-list",
              privilege: "ViewAllDepartments",
            },
          ],
          privilege: "ViewAllDepartments",
        },
        {
          key: "staffManagement",
          label: "Staff ",
          icon: <FaUsers className={styles.menuIcon} />,
          subItems: [
            {
              label: "View Staff List",
              href: "/Admin/Staff-List",
              privilege: "ViewStaffs",
            },
          ],
          privilege: "ViewStaffs",
        },

        {
          key: "clientManagement",
          label: "Client Management",
          icon: <FaUser className={styles.menuIcon} />,
          subItems: [
            {
              label: "Create Client Account",
              href: "/Staff/Clients/Create-Client",
              privilege: "CreateClient",
            },
            {
              label: "View Client List",
              href: "/Staff/Clients",
              privilege: "ViewClients",
            },
          ],
          privilege: "ViewClients",
        },
        {
          key: "loanManagement",
          label: "Loan Management",
          icon: <FaMoneyBill className={styles.menuIcon} />,
          subItems: [
            {
              label: "Create Loan Application",
              href: "/Staff/Loan/Loan-Application",
              privilege: "CreateLoanApplication",
            },
            {
              label: "View Loan Applications",
              href: "/Staff/Loan",
              privilege: "ViewLoanApplications",
            },
            {
              label: "Process Interest Rates",
              href: "/Staff/Loan/Interest/process",
              privilege: "ProcessInterestRates",
            },
            {
              label: "Computed Interest Listing",
              href: "/Staff/Loan/Interest/listing",
              privilege: "ViewComputedInterestListing",
            },
            {
              label: "Process Default Charges",
              href: "/Staff/Loan/defaults/process",
              privilege: "ProcessDefaultCharges",
            },
            {
              label: "Computed Default Charges Listing",
              href: "/Staff/Loan/defaults/listing",
              privilege: "ViewComputedDefaultChargesListing",
            },
          ],
          privilege: "ViewLoanApplications",
        },
        {
          key: "Transactions",
          label: "Transactions",
          icon: <GrTransaction className={styles.menuIcon} />,
          subItems: [
            {
              label: "Select Approved Loans",
              href: "/Staff/Transactions/Approved-Loans",
              privilege: "SelectApprovedLoans",
            },
            {
              label: "Create Transaction",
              href: "/Staff/Transactions/New",
              privilege: "CreateTransaction",
            },
            {
              label: "Transaction History",
              href: "/Staff/Transactions/History",
              privilege: "ViewTransactionHistory",
            },
          ],
          privilege: "CreateTransaction",
        },
        {
          key: "enquiries",
          label: "Enquiries",
          icon: <FaQuestionCircle className={styles.menuIcon} />,
          subItems: [
            {
              label: "Client Loan Enquiry",
              href: "/Staff/Enquiries/loan",
              privilege: "ClientLoanEnquiry",
            },
          ],
          privilege: "ClientLoanEnquiry",
        },
        {
          key: "reports",
          label: "Reports",
          icon: <FaChartBar className={styles.menuIcon} />,
          subItems: [
            {
              label: "Client Statement of Account",
              href: "/Staff/Reports/statement",
              privilege: "ClientStatementOfAccount",
            },
          ],
          privilege: "ClientStatementOfAccount",
        },
        {
          key: "settings",
          label: "Settings",
          icon: <FaCog className={styles.menuIcon} />,
          subItems: [
            {
              label: "System Configuration",
              href: "/Staff/Settings/configuration",
              privilege: "SystemConfiguration",
            },
          ],
          privilege: "SystemConfiguration",
        },
      ];

      const filteredMenuItems = allMenuItems.filter((item) => {
        if (item.privilege && !rolePrivileges.includes(item.privilege)) {
          return false;
        }
        if (item.subItems) {
          item.subItems = item.subItems.filter(
            (subItem) =>
              !subItem.privilege || rolePrivileges.includes(subItem.privilege)
          );
          return item.subItems.length > 0;
        }
        return true;
      });
      setMenuItems(filteredMenuItems);
    } else {
      setMenuItems([]);
    }
  }, [loadingPrivileges, rolePrivileges]);

  const toggleMenu = (menu) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className={styles.sidebar}>
      {authLoading || loadingPrivileges ? (
        <div className={styles.spinnerContainer}>
          <HashLoader color="#333" size={60} />
        </div>
      ) : (
        <ul className={styles.menu}>
          {menuItems.map((item) => (
            <li className={styles.menuItem} key={item.key}>
              <span onClick={() => toggleMenu(item.key)}>
                {item.icon}
                {item.label}
                {openMenus[item.key] ? (
                  <FaChevronUp className={styles.chevron} />
                ) : (
                  <FaChevronDown className={styles.chevron} />
                )}
              </span>
              {openMenus[item.key] && item.subItems && (
                <ul className={styles.subMenu}>
                  {item.subItems.map((subItem) => (
                    <li key={subItem.label}>
                      <Link href={subItem.href}>{subItem.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          <li className={styles.lastItem}>
            <span className={styles.logout} onClick={handleLogout}>
              <FaSignOutAlt className={styles.menuIcon} />
              Logout
            </span>
          </li>
        </ul>
      )}
    </div>
  );
};

export default StaffSidebar;
