import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import UsersPage from "./UserManagement"; // Quản lý người dùng
import ProductsPage from "./ProductManagement"; // Quản lý sản phẩm
import styles from "./AdminPage.module.css";


function AdminPage() {
    const location = useLocation();
  
    const navLinkClass = (path) =>
        `${styles.link} ${location.pathname === path ? styles.active : ""}`;
      
  
    return (
      <div className={styles.container}>
        <nav className={styles.navbar}>
          <div className={styles.navTitle}>Admin Panel</div>
          <div className={styles.navLinks}>
            <Link to="/admin/users" className={navLinkClass("users")}>
              Quản lý người dùng
            </Link>
            <Link to="products" className={navLinkClass("products")}>
              Quản lý sản phẩm
            </Link>
          </div>
        </nav>
  
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="products" element={<ProductsPage />} />
          </Routes>
        </main>
      </div>
    );
  }
  
  export default AdminPage;
  