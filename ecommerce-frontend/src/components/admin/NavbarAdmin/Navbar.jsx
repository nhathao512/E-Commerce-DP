// src/components/common/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa"; // Import icon exit
import styles from "./Navbar.module.css";
import logo from "../../../assets/logo.png"; // Import logo

function Navbar() {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                {/* Logo */}
                <div className={styles.logoContainer}>
                <Link to="/admin">
                        <img src={logo} alt="Logo" className={styles.logo} />
                    </Link>
                </div>

                {/* Các liên kết admin */}
                <div className={styles.leftLinks}>
                    <li><Link to="/admin" className={styles.navLink}>Trang chủ</Link></li>
                    <li><Link to="/admin/products" className={styles.navLink}>Sản phẩm</Link></li>
                    <li><Link to="/admin/categories" className={styles.navLink}>Danh mục</Link></li>
                    <li><Link to="/admin/orders" className={styles.navLink}>Đơn hàng</Link></li>
                    <li><Link to="/admin/users" className={styles.navLink}>Tài khoản</Link></li>
                </div>

                {/* Nút thoát sang trang người dùng */}
                <div className={styles.rightLink}>
                    <li>
                        <Link to="/" className={styles.exitLink}>
                            <FaSignOutAlt className={styles.exitIcon} />
                            <span className={styles.exitText}>Thoát</span>
                        </Link>
                    </li>
                </div>
            </ul>
        </nav>
    );
}

export default Navbar;