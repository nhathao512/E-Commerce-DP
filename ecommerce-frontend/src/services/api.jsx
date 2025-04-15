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

// API cho sản phẩm
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

// API cho giỏ hàng
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

// API cho tỉnh/thành
export const getProvinces = () => API.get("/provinces");

// API cho đơn hàng
export const processPayment = (paymentData) =>
  API.post("/orders/create", paymentData.items, {
    params: {
      userId: paymentData.userId,
      paymentMethod: paymentData.method,
      total: paymentData.total,
      name: paymentData.name,
      phone: paymentData.phone,
      address: paymentData.address,
      voucher: paymentData.voucher || null,
      transferCode: paymentData.transferCode || null,
      cardNumber: paymentData.cardNumber || null,
      cardExpiry: paymentData.cardExpiry || null,
      cardCVC: paymentData.cardCVC || null,
    },
  });

export const getOrdersByUserId = (userId) => API.get(`/orders/user/${userId}`);

// Thêm API để lấy tất cả đơn hàng
export const getAllOrders = () => API.get("/orders");

// Thêm API để cập nhật đơn hàng
export const updateOrder = (id, order) => API.put(`/orders/${id}`, order);

// Thêm API để xóa đơn hàng
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

// API cho trạng thái đơn hàng
export const updateOrderStatus = (orderId, status) =>
  API.put(`/orders/${orderId}/status`, null, {
    params: { status },
  });

// API cho đánh giá
export const addReview = (data) => API.post("/reviews", data);
export const getReviews = (productCode) =>
  API.get(`/reviews/product/${productCode}`);

// API cho danh mục
export const getAllCategories = () => API.get("/categories");
export const addCategory = (name, icon) =>
  API.post("/categories", null, { params: { name, icon } });
export const updateCategory = (id, name, icon) =>
  API.put(`/categories/${id}`, null, { params: { name, icon } });
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

export default API;
