import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const response = await API.get(
            `/auth/me?username=${parsedUser.username}`
          );
          const fetchedUser = response.data;

          if (fetchedUser.error) {
            throw new Error(fetchedUser.error);
          }

          setUser(fetchedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to verify auth:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await API.post("/auth/login", { username, password });
      const { id, token, ...userData } = response.data; // Destructured đúng: id và token
      localStorage.setItem("userID", id);
      localStorage.setItem("token", token); // Lưu token thực sự
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      return { token, id }; // Trả về token và id
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (username, password, phone, address, fullName) => {
    try {
      const response = await API.post("/auth/register", {
        username,
        password,
        phone,
        address,
        fullName,
      });
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;