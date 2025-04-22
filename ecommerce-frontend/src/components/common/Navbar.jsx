import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../../assets/logo.png";
import defaultAvatar from "../../assets/defaultAvatar.jpg";
import { AuthContext } from "../../context/AuthContext";
import { getCart } from "../../services/api";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const stompClientRef = useRef(null);
  const navigate = useNavigate();

  const backendBaseUrl = "http://localhost:8080/api/images";
  const webSocketUrl = "http://localhost:8080/api/ws";
  const avatarUrl = user?.avatar
    ? `${backendBaseUrl}/${user.avatar}?t=${Date.now()}`
    : null;

  // Fetch cart count using getCart from api.jsx
  const fetchCartCount = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setCartCount(0);
      return;
    }

    try {
      console.log("Fetching cart count for user:", user.id);
      const response = await getCart(user.id);
      const count = response.data.length || 0;
      setCartCount(count);
      setError(null);
      console.log("Cart count fetched:", count);
    } catch (err) {
      const errorMsg =
        err.response?.headers["error-message"] || "Failed to fetch cart count";
      setError(errorMsg);
      setCartCount(0);
      console.error("Error fetching cart count:", errorMsg);
    }
  }, [isAuthenticated, user?.id]);

  // Fetch initial cart count
  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  // WebSocket setup for real-time cart updates
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setCartCount(0);
      return;
    }

    console.log("Setting up WebSocket for user:", user.id);
    const socket = new SockJS(webSocketUrl);
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log("WebSocket debug:", str),
      onConnect: () => {
        console.log("Connected to WebSocket for user:", user.id);
        client.subscribe(`/user/${user.id}/topic/cart`, (message) => {
          try {
            console.log("WebSocket message received:", message.body);
            const cartUpdate = JSON.parse(message.body);
            const newCount = Number(cartUpdate.itemCount) || 0;
            setCartCount(newCount);
            setError(null);
            console.log("Cart count updated via WebSocket:", newCount);
          } catch (err) {
            console.error("Error parsing WebSocket message:", err);
            setError("Invalid WebSocket message");
          }
        });
      },
      onStompError: (frame) => {
        console.error("WebSocket error:", frame);
        setError("Failed to connect to WebSocket");
        fetchCartCount(); // Fallback to HTTP
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      console.log("Disconnected from WebSocket");
    };
  }, [isAuthenticated, user?.id, fetchCartCount]);

  // Handle cartUpdated event as fallback
  useEffect(() => {
    const handleCartUpdated = () => {
      console.log("Received cartUpdated event");
      fetchCartCount(); // Fallback if WebSocket fails
    };
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, [fetchCartCount]);

  // Handle scroll for fixed navbar
  useEffect(() => {
    const handleScroll = debounce(() => {
      setIsScrolled(window.scrollY > 50);
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      searchQuery.trim()
        ? `/products?search=${encodeURIComponent(searchQuery)}`
        : "/products"
    );
    setSearchQuery("");
  };

  // Handle logout with page reload
  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      setCartCount(0);
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Dropdown handlers
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const handleMouseLeave = () => setIsDropdownOpen(false);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.navLeft}>
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

      <div className={styles.navRight}>
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
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 0 0 0 4 2 2 0 0 0 0-4zm-10 2a2 2 0 0 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
            {cartCount != 0 ? (
              <span className={styles.cartCount}>{cartCount}</span>
            ) : null}
          </div>
        </Link>

        {isAuthenticated ? (
          <div
            className={styles.navBarProfile}
            onClick={toggleDropdown}
            onMouseLeave={handleMouseLeave}
            ref={dropdownRef}
          >
            <div className={styles.profileTrigger}>
              <img
                src={avatarUrl || defaultAvatar}
                alt="Avatar"
                className={styles.userAvatar}
                onError={(e) => {
                  console.log("Avatar load error:", e);
                  e.target.src = defaultAvatar;
                }}
              />
              <span>{user.fullName}</span>
            </div>
            <ul
              className={`${styles.navProfileDropdown} ${
                isDropdownOpen ? styles.show : ""
              }`}
            >
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
                  <path d="M16 10a4 4 0 1 1-8 0" />
                </svg>
                <p>Theo dõi đơn hàng</p>
              </li>
              <hr />
              <li onClick={handleLogout}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 1 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <p>Đăng xuất</p>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className={styles.navLink}>
            Đăng nhập
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
