import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);
export const getCart = () => API.get("/cart");
export const addToCart = (product, quantity) =>
  API.post(`/cart/add?quantity=${quantity}`, product);
export const processPayment = (method) => API.post("/payment", { method });
export const addReview = (data) => API.post("/reviews", data); // Sửa từ GET thành POST
export const getReviews = (productCode) =>
  API.get(`/reviews/product/${productCode}`);
export const getAllCategories = () => API.get("/categories");
export const addCategory = (name, icon) =>
  API.post("/categories", null, { params: { name, icon } });
export const updateCategory = (id, name, icon) =>
  API.put(`/categories/${id}`, null, { params: { name, icon } });
export const deleteCategory = (id) => API.delete(`/categories/${id}`);
