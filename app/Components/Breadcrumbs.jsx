"use client";
import React from "react";
import styles from "./css/Header.module.css";
import { usePathname } from "next/navigation";

const menuStructure = {
  "Staff Management": {
    "/Admin/Staff-List": "View Staff List",
  },
  "Branch Management": {
    "/Admin/Branch-List": " View Branch List",
  },
  "Manage Roles": {
    "/Admin/Manage-Roles": "View Role List",
  },
  "Admin Profile": {
    "/Admin/Profile": "View Profile",
  },
  "Admin Notifications": {
    "/Admin/Notifications": "View Notifications",
  },
  " Activity Log": {
    "/Admin/Activity-Log": "View Activity Log",
  },
  "Manage Privileges": {
    "/Admin/Privilege": "View Privilege List",
  },
  Client: {
    "/Staff/Clients": "View Client List",
    "/Staff/Clients/Create-Client": "Create Client Account",
    "/Staff/Clients/[clientId]": "View Client Details",
  },
  Loan: {
    "/Staff/Loan": "View Loan Applications",
    "/Staff/Loan/[loanId]": "View Loan Details",
    "/Staff/Loan/Interest/listing": "View Interest Rate List",
    "/Staff/Loan/Interest/process": "Process Interest Rate ",
    "/Staff/Loan/defaults/process": "Process Defaulted charges",
    "/Staff/Loan/defaults/listing": "View Defaulted Charges",
    "/Staff/Loan/Loan-Application": "Create Loan Account",
  },
  Enquiries: {
    "/Staff/Enquiries/loan": "View Loan Enquiry",
  },
  Reports: {
    "/Staff/Reports/statement": "Generate Client Statement of account",
  },
  Settings: {
    "/Staff/Settings/configuration": "Configure System Settings",
  },
  Profile: {
    "/Staff/Profile": "View Profile",
  },
  Notifications: {
    "/Staff/Notifications": "View Notifications",
  },
  Activity: {
    "/Staff/Activity-Log": "View Activity Log",
  },
  Transactions: {
    "/Staff/Transactions/Approved-Loans": "View Approved Loans",
  },
};

const Breadcrumbs = () => {
  const pathName = usePathname();
  const currentPath = decodeURIComponent(pathName); // Decode the current path

  let breadcrumbMenu = null;
  let breadcrumbSubmenu = null;

  // Loop through menuStructure to find the matching breadcrumb
  Object.entries(menuStructure).forEach(([menu, submenus]) => {
    Object.entries(submenus).forEach(([submenuPath, submenuName]) => {
      // Handle dynamic routes
      if (submenuPath.includes("[clientId]")) {
        const baseSubmenuPath = submenuPath.replace("[clientId]", "");
        if (currentPath.startsWith(baseSubmenuPath)) {
          breadcrumbMenu = menu;
          breadcrumbSubmenu = submenuName;
        }
      } else if (submenuPath.includes("[loanId]")) {
        // Add this block
        const baseSubmenuPath = submenuPath.replace("[loanId]", "");
        if (currentPath.startsWith(baseSubmenuPath)) {
          breadcrumbMenu = menu;
          breadcrumbSubmenu = submenuName;
        }
      } else if (submenuPath === currentPath) {
        breadcrumbMenu = menu;
        breadcrumbSubmenu = submenuName;
      }
    });
  });

  console.log("breadcrumbMenu:", breadcrumbMenu);
  console.log("breadcrumbSubmenu:", breadcrumbSubmenu);

  return (
    <nav className={styles.breadcrumbs}>
      <ul>
        {breadcrumbMenu && (
          <>
            <li>
              <span>{breadcrumbMenu}</span>
              <span className={styles.breadcrumbSeparator}>/</span>
            </li>
            <li>
              <span className={styles.breadcrumbActive}>
                {breadcrumbSubmenu}
              </span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
