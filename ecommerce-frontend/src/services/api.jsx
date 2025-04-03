import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = () => API.get("/products");
export const getCart = () => API.get("/cart");
export const addToCart = (productId, quantity) =>
  API.post("/cart", { productId, quantity });
export const processPayment = (method) => API.post("/payment", { method });
export const addReview = (data) => API.post("/reviews", data);
export const getReviews = (productId) =>
  API.get(`/reviews?productId=${productId}`);
