"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect, createContext, useContext } from "react";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/Authentication`;

const AuthContext = createContext();

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userDetails = JSON.parse(localStorage.getItem("user"));

    if (token && userDetails) {
      setUser({ token, ...userDetails });
    }
    setLoading(false);
  }, []);

  const login = async (emailOrStaffCode, password) => {
    try {
      const response = await axios.post(`${API_URL}/Login`, {
        emailOrStaffCode,
        password,
      });

      console.log("Full Response Data:", response.data); // Log the entire response

      const { token, refreshToken } = response.data;
      const StaffCode = response.data.staffCode;
      const Email = response.data.email;
      const role = response.data.role;
      const PositionCode = response.data.positionCode;
      const DepartmentCode = response.data.departmentCode;
      const BranchCode = response.data.branchCode;
      const StaffPersonalInformation = response.data.staffPersonalInformation;

      console.log(
        "StaffPersonalInformation before localStorage:",
        StaffPersonalInformation
      );

      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          StaffCode,
          Email,
          role,
          PositionCode,
          DepartmentCode,
          BranchCode,
          firstName: StaffPersonalInformation?.firstName,
          lastName: StaffPersonalInformation?.lastName,
          gender: StaffPersonalInformation?.gender,
          martialStatus: StaffPersonalInformation?.martialStatus,
          dateOfBirth: StaffPersonalInformation?.dateOfBirth,
          address: StaffPersonalInformation?.address,
          emailPersonal: StaffPersonalInformation?.email?.value,
          phone: StaffPersonalInformation?.phone,
          staffImage: StaffPersonalInformation?.staffImage,
          roleID: StaffPersonalInformation?.roleID,
          positionID: StaffPersonalInformation?.positionID,
          departmentID: StaffPersonalInformation?.departmentID,
          branchID: StaffPersonalInformation?.branchID,
        })
      );

      setUser({
        token,
        StaffCode,
        Email,
        role,
        PositionCode,
        DepartmentCode,
        BranchCode,
        firstName: StaffPersonalInformation?.firstName,
        lastName: StaffPersonalInformation?.lastName,
        gender: StaffPersonalInformation?.gender,
        martialStatus: StaffPersonalInformation?.martialStatus,
        dateOfBirth: StaffPersonalInformation?.dateOfBirth,
        address: StaffPersonalInformation?.address,
        emailPersonal: StaffPersonalInformation?.email?.value,
        phone: StaffPersonalInformation?.phone,
        staffImage: StaffPersonalInformation?.staffImage,
        roleID: StaffPersonalInformation?.roleID,
        positionID: StaffPersonalInformation?.positionID,
        departmentID: StaffPersonalInformation?.departmentID,
        branchID: StaffPersonalInformation?.branchID,
      });

      // Fetch all roles to find the privileges for the user's roleID
      const allRolesResponse = await axios.get(
        "https://localhost:65396/api/Role/all"
      ); // Adjust the API endpoint if needed
      const allRoles = allRolesResponse.data;

      const userRole = allRoles.find(
        (fetchedRole) => fetchedRole.role_id === role
      );
      console.log(userRole);
      let privileges = [];
      if (userRole && userRole.privileges) {
        privileges = userRole.privileges.map((privilege) => privilege.name);
      }

      console.log("Fetched Privileges:", privileges);

      // Prioritized redirection
      const privilegePriorities = {
        ViewStaffs: 10,
        ViewAllBranches: 9,
        ViewRoles: 8,
        ViewAllPositions: 7,
        ViewAllDepartments: 6,
        ViewClients: 5,
        ViewLoanApplications: 4,
        CreateTransaction: 3,
        ClientLoanEnquiry: 2,
        ClientStatementOfAccount: 1,
        SystemConfiguration: 0,
      };

      let highestPriority = -1;
      let redirectRoute = "/"; // Default route

      if (privileges && privileges.length > 0) {
        privileges.forEach((privilege) => {
          if (
            privilegePriorities[privilege] !== undefined &&
            privilegePriorities[privilege] > highestPriority
          ) {
            highestPriority = privilegePriorities[privilege];
            switch (privilege) {
              case "ViewStaffs":
                redirectRoute = "/Admin/Staff-List";
                break;
              case "ViewAllBranches":
                redirectRoute = "/Admin/Branch-List";
                break;
              case "ViewRoles":
                redirectRoute = "/Admin/Role-List";
                break;
              case "ViewAllPositions":
                redirectRoute = "/Admin/Positions-List";
                break;
              case "ViewAllDepartments":
                redirectRoute = "/Admin/Departments-list";
                break;
              case "ViewClients":
                redirectRoute = "/Staff/Clients";
                break;
              case "ViewLoanApplications":
                redirectRoute = "/Staff/Loan";
                break;
              case "CreateTransaction":
                redirectRoute = "/Staff/Transactions/New";
                break;
              case "ClientLoanEnquiry":
                redirectRoute = "/Staff/Enquiries/loan";
                break;
              case "ClientStatementOfAccount":
                redirectRoute = "/Staff/Reports/statement";
                break;
              case "SystemConfiguration":
                redirectRoute = "/Staff/Settings/configuration";
                break;
              default:
                break;
            }
          }
        });
      }
      router.push(redirectRoute);
    } catch (error) {
      console.error("Login Error:", error);
      console.error("Error Response Data:", error.response?.data);
      throw error.response?.data?.message || "Login failed";
    }
  };

  const logout = async (refreshToken) => {
    try {
      await axios.post(`${API_URL}/Logout`, { refreshToken });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      router.push("/");
    } catch (error) {
      throw error.response?.data?.message || "Logout failed";
    }
  };

  const refreshToken = async (refreshToken) => {
    try {
      const response = await axios.post(`${API_URL}/RefreshToken`, {
        refreshToken,
      });
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Token refresh failed";
    }
  };

  const resetPassword = async (email) => {
    try {
      await axios.post(`${API_URL}/ResetPassword`, { email });
    } catch (error) {
      throw error.response?.data?.message || "Reset password failed";
    }
  };

  const setPassword = async (staffCode, defaultPassword, newPassword) => {
    try {
      await axios.post(`${API_URL}/SetPassword`, {
        staffCode,
        defaultPassword,
        newPassword,
      });
    } catch (error) {
      throw error.response?.data?.message || "Set password failed";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refreshToken,
        resetPassword,
        setPassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Axios Interceptors for Auto Token Handling
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);
