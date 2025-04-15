import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";
import { getCart } from "../services/api";

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

          // Đồng bộ giỏ hàng sau khi xác minh
          const userId = localStorage.getItem("userId"); // Đổi "userID" thành "userId"
          if (userId) {
            try {
              const cartResponse = await getCart(userId);
              const cartData = cartResponse.data;
              const mappedCartData = cartData.map((item) => ({
                id: item.product.id,
                productName: item.product.name,
                imageUrl:
                  item.product.images && item.product.images.length > 0
                    ? `http://localhost:8080/api/images/${item.product.images[0]}`
                    : null,
                price: item.product.price,
                quantity: item.quantity,
                size: item.size,
              }));
              localStorage.setItem("cartItems", JSON.stringify(mappedCartData));
              window.dispatchEvent(new Event("cartUpdated"));
            } catch (cartError) {
              console.error("Failed to fetch cart after auth:", cartError);
              localStorage.setItem("cartItems", JSON.stringify([]));
              window.dispatchEvent(new Event("cartUpdated"));
            }
          }
        } catch (error) {
          console.error("Failed to verify auth:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("userId"); // Đổi "userID" thành "userId"
          localStorage.removeItem("cartItems");
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        localStorage.removeItem("cartItems");
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
      const { id, token, ...userData } = response.data;
      localStorage.setItem("userId", id); // Đổi "userID" thành "userId"
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);

      // Đồng bộ giỏ hàng sau khi đăng nhập
      try {
        const cartResponse = await getCart(id);
        const cartData = cartResponse.data;
        const mappedCartData = cartData.map((item) => ({
          id: item.product.id,
          productName: item.product.name,
          imageUrl:
            item.product.images && item.product.images.length > 0
              ? `http://localhost:8080/api/images/${item.product.images[0]}`
              : null,
          price: item.product.price,
          quantity: item.quantity,
          size: item.size,
        }));
        localStorage.setItem("cartItems", JSON.stringify(mappedCartData));
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (cartError) {
        console.error("Failed to fetch cart after login:", cartError);
        localStorage.setItem("cartItems", JSON.stringify([]));
        window.dispatchEvent(new Event("cartUpdated"));
      }

      return { token, id };
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

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId"); // Đổi "userID" thành "userId"
    localStorage.removeItem("cartItems");

    setIsAuthenticated(false);
    setUser(null);

    window.dispatchEvent(new Event("cartUpdated"));
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
