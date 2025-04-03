import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Thay Switch bằng Routes
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <div style={{ padding: "20px" }}>
            <Routes>
              <Route path="/register" element={<Register />} />{" "}
              {/* Thay component bằng element */}
              <Route path="/login" element={<Login />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/review" element={<ReviewForm />} />
              <Route path="/reviews" element={<ReviewList />} />
              <Route path="/" element={<ProductList />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
