"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Add token state

  useEffect(() => {
    const storedToken = localStorage.getItem("token"); // Use localStorage
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (newToken, userData) => {
    // Accept token and user data
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken); // Store token
    // Optionally, store user data separately if needed
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
