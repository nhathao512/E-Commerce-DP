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
import { useState, useRef } from "react";

function AdminPage() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState({
    users: 1,
    products: 1,
    orders: 1,
    categories: 1,
  });

  const usersTableRef = useRef(null);
  const productsTableRef = useRef(null);
  const ordersTableRef = useRef(null);
  const categoriesTableRef = useRef(null);

  const itemsPerPage = 5;

  const navLinkClass = (path) =>
    `${location.pathname === path ? styles.activeLink : ""}`;

  // Sample data (replace with your actual data source)
  const usersData = [
    { id: 1, username: "viet", password: "admin123" },
    { id: 2, username: "hao", password: "admin123" },
    { id: 3, username: "huy", password: "admin123" },
    { id: 4, username: "trung", password: "admin123" },
    { id: 5, username: "user5", password: "admin123" },
    { id: 6, username: "user6", password: "admin123" },
    { id: 7, username: "user7", password: "admin123" },
  ];

  const productsData = [
    { id: 1, code: 1, name: "Product 1", description: "Description 1", price: "100,000", image: "URL", categoryId: 1, quantity: 10 },
    { id: 2, code: 2, name: "Product 2", description: "Description 2", price: "90,000", image: "URL", categoryId: 2, quantity: 20 },
    { id: 3, code: 3, name: "Product 3", description: "Description 3", price: "80,000", image: "URL", categoryId: 1, quantity: 15 },
    { id: 4, code: 4, name: "Product 4", description: "Description 4", price: "70,000", image: "URL", categoryId: 2, quantity: 25 },
    { id: 5, code: 5, name: "Product 5", description: "Description 5", price: "60,000", image: "URL", categoryId: 1, quantity: 30 },
    { id: 6, code: 6, name: "Product 6", description: "Description 6", price: "50,000", image: "URL", categoryId: 2, quantity: 40 },
  ];

  const ordersData = [
    { id: 1, userId: 1, items: "Product 1", total: "100,000", paymentMethod: "Bank transfer" },
    { id: 2, userId: 2, items: "Product 2", total: "90,000", paymentMethod: "Credit Card" },
    { id: 3, userId: 3, items: "Product 3", total: "80,000", paymentMethod: "Cash" },
    { id: 4, userId: 4, items: "Product 4", total: "70,000", paymentMethod: "Bank transfer" },
    { id: 5, userId: 1, items: "Product 5", total: "60,000", paymentMethod: "Credit Card" },
    { id: 6, userId: 2, items: "Product 6", total: "50,000", paymentMethod: "Cash" },
  ];

  const categoriesData = [
    { id: 1, name: "Category 1" },
    { id: 2, name: "Category 2" },
    { id: 3, name: "Category 3" },
    { id: 4, name: "Category 4" },
    { id: 5, name: "Category 5" },
    { id: 6, name: "Category 6" },
  ];

  // Scroll to table
  const scrollToTable = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  // Pagination logic
  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = (data) => {
    return Math.ceil(data.length / itemsPerPage);
  };

  const handlePageChange = (section, page) => {
    setCurrentPage((prev) => ({ ...prev, [section]: page }));
  };

  // Render pagination buttons
  const renderPagination = (section, totalPages) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.paginationButton} ${
            currentPage[section] === i ? styles.activePagination : ""
          }`}
          onClick={() => handlePageChange(section, i)}
        >
          {i}
        </button>
      );
    }
    return <div className={styles.pagination}>{pages}</div>;
  };

  return (
    <div className={styles.adminWrapper}>
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
                  </div>
                  <div className={styles.cardsContainer}>
                    <div
                      className={`${styles.card} ${styles.cardUsers}`}
                      onClick={() => scrollToTable(usersTableRef)}
                    >
                      <h4>Người dùng</h4>
                      <p>{usersData.length} người</p>
                    </div>
                    <div
                      className={`${styles.card} ${styles.cardProducts}`}
                      onClick={() => scrollToTable(productsTableRef)}
                    >
                      <h4>Sản phẩm</h4>
                      <p>{productsData.length} sản phẩm</p>
                    </div>
                    <div
                      className={`${styles.card} ${styles.cardOrders}`}
                      onClick={() => scrollToTable(ordersTableRef)}
                    >
                      <h4>Đơn hàng</h4>
                      <p>{ordersData.length} đơn</p>
                    </div>
                    <div
                      className={`${styles.card} ${styles.cardCategories}`}
                      onClick={() => scrollToTable(categoriesTableRef)}
                    >
                      <h4>Danh mục</h4>
                      <p>{categoriesData.length} loại</p>
                    </div>
                  </div>

                  <div className={styles.tableSection} ref={usersTableRef}>
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
                        {getPaginatedData(usersData, currentPage.users).map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.password}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {renderPagination("users", getTotalPages(usersData))}
                  </div>

                  <div className={styles.tableSection} ref={productsTableRef}>
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
                        {getPaginatedData(productsData, currentPage.products).map((product) => (
                          <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.code}</td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.price}</td>
                            <td>{product.image}</td>
                            <td>{product.categoryId}</td>
                            <td>{product.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {renderPagination("products", getTotalPages(productsData))}
                  </div>

                  <div className={styles.tableSection} ref={ordersTableRef}>
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
                        {getPaginatedData(ordersData, currentPage.orders).map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.userId}</td>
                            <td>{order.items}</td>
                            <td>{order.total}</td>
                            <td>{order.paymentMethod}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {renderPagination("orders", getTotalPages(ordersData))}
                  </div>

                  <div className={styles.tableSection} ref={categoriesTableRef}>
                    <h3>Danh sách danh mục</h3>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaginatedData(categoriesData, currentPage.categories).map((category) => (
                          <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {renderPagination("categories", getTotalPages(categoriesData))}
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
    </div>
  );
}

export default AdminPage;