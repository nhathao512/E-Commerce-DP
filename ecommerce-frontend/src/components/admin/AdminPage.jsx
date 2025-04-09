import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import UsersPage from "./UserManagement"; // Quản lý người dùng
import ProductsPage from "./ProductManagement"; // Quản lý sản phẩm
import CategoriesPage from "./CategoriesManagement"; // Quản lý danh mục
import OrderPage from "./OrderManagement"; // Quản lý đơn hàng
import styles from "./AdminPage.module.css";
import OrderManagement from "./OrderManagement";


function AdminPage() {
  const location = useLocation();

  const navLinkClass = (path) =>
    `${styles.link} ${
      location.pathname === `/admin/${path}` ? styles.active : ""
    }`;

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navTitle}>Admin Panel</div>
        <div className={styles.navLinks}>
          <Link to="/admin/users" className={navLinkClass("users")}>
            Quản lý người dùng
          </Link>
          <Link to="/admin/products" className={navLinkClass("products")}>
            Quản lý sản phẩm
          </Link>
          <Link to="/admin/categories" className={navLinkClass("categories")}>
            Quản lý danh mục
          </Link>
          <Link to="/admin/orders" className={navLinkClass("orders")}>
            Quản lý đơn hàng
          </Link>
        </div>
      </nav>

      <main className={styles.main}>
        <Routes>
          {/* Trang chính khi vào /admin */}
          <Route
            path="/"
            element={
              <div>
                <div className={styles.headerBox}>
                  <h2>Chào mừng đến với trang quản trị</h2>
                  <p>Chọn một mục bên trên để bắt đầu quản lý.</p>
                </div>

                <div className={styles.section}>
                  {/* Bảng User */}
                  <h3>Danh sách người dùng</h3>
                  <table className={styles.table}>
                    <thead> 
                      <tr>
                        <th>Id</th>
                        <th>username</th>
                        <th>password</th>
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
                <div className={styles.section}>
                  {/* Bảng Order */}
                  <h3>Danh sách đơn hàng</h3>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>userId</th>
                        <th>items</th>
                        <th>total</th>
                        <th>paymentMethod</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>Product name</td>
                        <td>100,000</td>
                        <th>Bank transfer</th>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>2</td>
                        <td>Product name</td>
                        <td>90,000</td>
                        <th>Credit Card</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.section}>
                  {/* Bảng Order */}
                  <h3>Danh sách sản phẩm</h3>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>productCode</th>
                        <th>name</th>
                        <th>description</th>
                        <th>price</th>
                        <th>image</th>
                        <th>categoryId</th>
                        <th>quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>Product name</td>
                        <td>Product description</td>
                        <td>100,000</td>
                        <td>Image URL</td>
                        <td>1</td>
                        <td>10</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>2</td>
                        <td>Product name</td>
                        <td>Product description</td>
                        <td>90,000</td>
                        <td>Image URL</td>
                        <td>2</td>
                        <td>20</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className={styles.section}>
                  {/* Bảng Categories */}
                  <h3>Danh sách thể loại sản phẩm</h3>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>name</th>
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
              </div>
            }
          />
          <Route path="users" element={<UsersPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrderPage />} />
          {/* Chuyển hướng nếu không tìm thấy route */} 
        </Routes>
      </main>
    </div>
  );
}

export default AdminPage;

  