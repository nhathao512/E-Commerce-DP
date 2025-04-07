import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Navbar.module.css";
import logo from "../../assets/logo.png";

function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartCount(cartItems.length);
  };

  useEffect(() => {
    updateCartCount(); 

    window.addEventListener("storage", updateCartCount);
    
    // Cleanup listener khi component unmount
    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  // Lắng nghe sự kiện tùy chỉnh từ Cart
  useEffect(() => {
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    } else {
      navigate(`/products`);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div>
        <Link to="/">
          <img src={logo} alt="Logo" className={styles.logo} />
        </Link>
        <Link to="/" className={styles.navLink}>
          Trang chủ
        </Link>
        <Link to="/products" className={styles.navLink}>
          Sản phẩm
        </Link>
      </div>

      <div>
        <form onSubmit={handleSearch} className={styles.searchContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className={styles.searchInput}
          />
          <svg
            className={styles.searchIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            onClick={handleSearch}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </form>
        <Link to="/cart" className={styles.navLink}>
          <div className={styles.cartContainer}>
            <svg
              className={styles.cartIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-10 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
            {cartCount > 0 && (
              <span className={styles.cartCount}>{cartCount}</span>
            )}
          </div>
        </Link>

        {isAuthenticated ? (
          <>
            <span style={{ marginRight: "20px" }}>
              Xin chào, {user?.username}
            </span>
            <button onClick={logout} className={styles.logoutBtn}>
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.navLink}>
              Đăng nhập
            </Link>
            <Link to="/register" className={styles.navLink}>
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;