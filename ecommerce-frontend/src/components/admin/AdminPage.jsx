import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  FaUserCog,
  FaBoxOpen,
  FaClipboardList,
  FaTags,
  FaCogs,
} from "react-icons/fa";
import UsersPage from "./manageuser/UserManagement";
import ProductsPage from "./manageproduct/ProductManagement";
import CategoriesPage from "./managecategories/CategoriesManagement";
import OrderPage from "./manageorder/OrderManagement";
import styles from "./AdminPage.module.css";

function AdminPage() {
  const location = useLocation();

  const navLinkClass = (path) =>
    `${location.pathname === path ? styles.activeLink : ""}`;

  return (
    <div className={styles.adminLayout}>
      <div className={styles.sidebar}>
        <Link to="/admin" className={styles.logo}>
          <FaCogs style={{ marginRight: 8 }} /> Admin Panel
        </Link>
        <div className={styles.navLinks}>
          <Link to="/admin/users" className={navLinkClass("/admin/users")}>
            <FaUserCog /> Quản lý người dùng
          </Link>
          <Link
            to="/admin/products"
            className={navLinkClass("/admin/products")}
          >
            <FaBoxOpen /> Quản lý sản phẩm
          </Link>
          <Link
            to="/admin/categories"
            className={navLinkClass("/admin/categories")}
          >
            <FaTags /> Quản lý danh mục
          </Link>
          <Link to="/admin/orders" className={navLinkClass("/admin/orders")}>
            <FaClipboardList /> Quản lý đơn hàng
          </Link>
        </div>
      </div>

      <main className={styles.main}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className={styles.welcomeBox}>
                  <h2 className={styles.welcomeTitle}>
                    Chào mừng đến với trang quản trị
                  </h2>
                  <p className={styles.welcomeSubtitle}>
                    Chọn một mục bên trái để bắt đầu quản lý.
                  </p>
                </div>
                <div className={styles.cardsContainer}>
                  <div className={`${styles.card} ${styles.cardUsers}`}>
                    <h4>Người dùng</h4>
                    <p>4 người</p>
                  </div>
                  <div className={`${styles.card} ${styles.cardProducts}`}>
                    <h4>Sản phẩm</h4>
                    <p>2 sản phẩm</p>
                  </div>
                  <div className={`${styles.card} ${styles.cardOrders}`}>
                    <h4>Đơn hàng</h4>
                    <p>2 đơn</p>
                  </div>
                  <div className={`${styles.card} ${styles.cardCategories}`}>
                    <h4>Danh mục</h4>
                    <p>2 loại</p>
                  </div>
                </div>

                <div className={styles.tableSection}>
                  <h3>Danh sách người dùng</h3>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Password</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>viet</td>
                        <td>admin123</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>hao</td>
                        <td>admin123</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>huy</td>
                        <td>admin123</td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>trung</td>
                        <td>admin123</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className={styles.tableSection}>
                  <h3>Danh sách sản phẩm</h3>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Product Code</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Category ID</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>Product 1</td>
                        <td>Description 1</td>
                        <td>100,000</td>
                        <td>URL</td>
                        <td>1</td>
                        <td>10</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>2</td>
                        <td>Product 2</td>
                        <td>Description 2</td>
                        <td>90,000</td>
                        <td>URL</td>
                        <td>2</td>
                        <td>20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className={styles.tableSection}>
                  <h3>Danh sách đơn hàng</h3>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User ID</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>Product 1</td>
                        <td>100,000</td>
                        <td>Bank transfer</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>2</td>
                        <td>Product 2</td>
                        <td>90,000</td>
                        <td>Credit Card</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className={styles.tableSection}>
                  <h3>Danh sách danh mục</h3>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>Category 1</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>Category 2</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            }
          />
          <Route path="users" element={<UsersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrderPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminPage;
