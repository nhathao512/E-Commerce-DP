import React, { createContext, useState, useEffect } from "react";
import API from "../services/api";
import { getCart } from "../services/api";

// Hàm giải mã token JWT
const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      console.log("Initializing auth:", { token: !!token, storedUser: !!storedUser });

      if (token && storedUser) {
        try {
          const decodedToken = decodeToken(token);
          console.log("Decoded token:", decodedToken);
          if (!decodedToken || !decodedToken.userId) {
            throw new Error("Invalid token");
          }

          const parsedUser = JSON.parse(storedUser);
          const response = await API.get(
            `/auth/me?username=${parsedUser.username}`
          );
          const fetchedUser = response.data;
          console.log("Fetched user from /auth/me:", fetchedUser);

          if (fetchedUser.error || typeof fetchedUser.role !== "number") {
            throw new Error(fetchedUser.error || "Invalid user data");
          }

          setUser(fetchedUser);
          setIsAuthenticated(true);

          // Lưu userID vào localStorage (nếu chưa có)
          localStorage.setItem("userID", decodedToken.userId);

          // Đồng bộ giỏ hàng
          try {
            const cartResponse = await getCart(decodedToken.userId);
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
            console.log("Cart synchronized:", mappedCartData);
          } catch (cartError) {
            console.error("Failed to fetch cart after auth:", cartError);
            localStorage.setItem("cartItems", JSON.stringify([]));
            window.dispatchEvent(new Event("cartUpdated"));
          }
        } catch (error) {
          console.error("Failed to verify auth:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("userID");
          localStorage.removeItem("cartItems");
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        localStorage.removeItem("cartItems");
        localStorage.removeItem("userID");
        setIsAuthenticated(false);
        setUser(null);
        console.log("No token or user found, cleared localStorage");
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      // Xóa các giá trị cũ trong localStorage trước khi đăng nhập
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userID");
      localStorage.removeItem("cartItems");

      const response = await API.post("/auth/login", { username, password });
      const { id, token, role, ...userData } = response.data;
      console.log("Login response:", { id, role, userData });

      // Giải mã token để lấy userId
      const decodedToken = decodeToken(token);
      console.log("Decoded token on login:", decodedToken);
      if (!decodedToken || !decodedToken.userId) {
        throw new Error("Invalid token");
      }

      // Kiểm tra role
      if (typeof role !== "number") {
        throw new Error("Invalid role data");
      }

      // Lưu thông tin mới
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ ...userData, role }));
      localStorage.setItem("userID", decodedToken.userId);
      setUser({ ...userData, role });
      setIsAuthenticated(true);

      // Đồng bộ giỏ hàng
      try {
        const cartResponse = await getCart(decodedToken.userId);
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
        console.log("Cart synchronized after login:", mappedCartData);
      } catch (cartError) {
        console.error("Failed to fetch cart after login:", cartError);
        localStorage.setItem("cartItems", JSON.stringify([]));
        window.dispatchEvent(new Event("cartUpdated"));
      }

      return { token, id, role }; // Trả về role để xử lý redirect
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
      console.log("Register response:", userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Register failed:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("Logging out, clearing auth state");
    localStorage.clear(); // Clear all localStorage to prevent stale data
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