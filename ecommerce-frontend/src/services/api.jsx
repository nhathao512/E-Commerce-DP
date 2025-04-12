import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Interceptor to add Authorization token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Product-related APIs
export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);
export const addProduct = (product) => API.post("/products", product);
export const updateProduct = (id, product) =>
  API.put(`/products/${id}`, product);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Cart-related APIs
export const getCart = (userId) =>
  API.get("/cart", {
    params: { userId },
  });

export const addToCart = (product, quantity, size, userId) =>
  API.post("/cart/add", product, {
    params: {
      quantity,
      size,
      userId,
    },
  });


// Payment API
export const processPayment = (method) => API.post("/payment", { method });

// Review-related APIs
export const addReview = (data) => API.post("/reviews", data);
export const getReviews = (productCode) =>
  API.get(`/reviews/product/${productCode}`);

// Category-related APIs
export const getAllCategories = () => API.get("/categories");
export const addCategory = (name, icon) =>
  API.post("/categories", null, { params: { name, icon } });
export const updateCategory = (id, name, icon) =>
  API.put(`/categories/${id}`, null, { params: { name, icon } });
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export default API;