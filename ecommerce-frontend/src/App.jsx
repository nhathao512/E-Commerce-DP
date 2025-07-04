import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ProductList from "./components/product/ProductList";
import Cart from "./components/cart/Cart";
import Payment from "./components/payment/Payment";
import ReviewForm from "./components/review/ReviewForm";
import ReviewList from "./components/review/ReviewList";
import HomePage from "./components/home/HomePage";
import ProductDetail from "./components/detail/ProductDetail";
import AdminPage from "./components/admin/AdminPage";
import Profile from "./components/profile/Profile";
import UserOrderManagement from "./components/manageUserOrders/UserOrderManagement";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route
            path="*"
            element={
              <div>
                <Navbar />
                <div style={{ minHeight: "90vh" }}>
                  <Routes>
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/review" element={<ReviewForm />} />
                    <Route path="/reviews" element={<ReviewList />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<UserOrderManagement />} />
                    <Route path="/" element={<HomePage />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
