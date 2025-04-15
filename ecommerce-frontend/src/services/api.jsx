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

export const getProducts = () => API.get("/products");
export const getProductById = (id) => API.get(`/products/${id}`);
export const addProduct = (product) =>
  API.post("/products", product, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateProduct = (id, product) =>
  API.put(`/products/${id}`, product, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const deleteProduct = (id) => API.delete(`/products/${id}`);

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

export const updateCartItemQuantity = (userId, productId, size, quantity) =>
  API.put("/cart/update-quantity", null, {
    params: {
      userId,
      productId,
      size,
      quantity,
    },
  });

export const removeFromCart = (userId, productId, size) =>
  API.delete("/cart/remove", {
    params: { userId, productId, size },
  });

export const clearCart = (userId) =>
  API.delete("/cart/clear", {
    params: { userId },
  });

export const getProvinces = () => API.get("/provinces");

export const processPayment = (paymentData) =>
  API.post("/orders/create", paymentData.items, {
    params: {
      userId: paymentData.userId,
      paymentMethod: paymentData.paymentMethod,
      total: paymentData.total,
      name: paymentData.name,
      phone: paymentData.phone,
      address: paymentData.address,
      voucher: paymentData.voucher,
    },
  });

export const getOrdersByUserId = (userId) => API.get(`/orders/user/${userId}`);

export const updateOrderStatus = (orderId, status) =>
  API.put(`/orders/${orderId}/status`, null, {
    params: { status },
  });

export const addReview = (data) => API.post("/reviews", data);
export const getReviews = (productCode) =>
  API.get(`/reviews/product/${productCode}`);

export const getAllCategories = () => API.get("/categories");
export const addCategory = (name, icon) =>
  API.post("/categories", null, { params: { name, icon } });
export const updateCategory = (id, name, icon) =>
  API.put(`/categories/${id}`, null, { params: { name, icon } });
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export default API;
