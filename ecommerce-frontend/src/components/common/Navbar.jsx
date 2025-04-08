import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../../assets/logo.png";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  // const isAuthenticated = true;
  // const user = { username: "Hồ Việt" };
  // const logout = () => console.log("Đăng xuất");
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
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

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

  const handleLogoutWithReload = () => {
    logout();
    window.location.reload(); // Tương tự code mẫu
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
          <div className={styles.navBarProfile}>
            <div className={styles.profileTrigger}>
              <svg
                className={styles.userIcon}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Xin chào, {user?.username}</span>
            </div>
            <ul className={styles.navProfileDropdown}>
              <li onClick={() => navigate("/profile")}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <p>Trang cá nhân</p>
              </li>
              <hr />
              <li onClick={() => navigate("/orders")}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                <p>Theo dõi đơn hàng</p>
              </li>
              <hr />
              <li onClick={handleLogoutWithReload}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <p>Đăng xuất</p>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <Link to="/login" className={styles.navLink}>
              Đăng nhập
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
