import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  FaUserCog,
  FaBoxOpen,
  FaClipboardList,
  FaTags,
  FaCogs,
  FaPlus,
  FaFileExport,
  FaChartLine,
  FaArrowLeft,
  FaArrowRight,
  FaSignOutAlt,
} from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import UsersPage from "./manageuser/UserManagement";
import ProductsPage from "./manageproduct/ProductManagement";
import CategoriesPage from "./managecategories/CategoriesManagement";
import OrderPage from "./manageorder/OrderManagement";
import styles from "./AdminPage.module.css";
import { useState, useEffect } from "react";
import logo from "../../assets/logo1.png";
import { getProducts, getAllOrders } from "../../services/api"; // Import getAllOrders
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function AdminPage() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState({
    topProducts: 1,
    topUsers: 1,
  });
  const [chartType, setChartType] = useState("bar");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [ordersData, setOrdersData] = useState([]); // State for orders
  const itemsPerPage = 5;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        const validProducts = response.data
          .filter(
            (product) =>
              product &&
              product.name &&
              typeof product.name === "string"
          )
          .map((product) => ({
            ...product,
            images: Array.isArray(product.images) ? product.images : [],
          }));
        setProductsData(validProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/users");
        setUsersData(response.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        setOrdersData(response.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const navLinkClass = (path) =>
    `${location.pathname === path ? styles.activeLink : ""}`;

  // Calculate monthly revenue (completed orders)
  const monthlyRevenue = ordersData
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.total, 0)
    .toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // Top products by purchase count
  const productCounts = ordersData
    .filter((order) => order.status === "completed")
    .reduce((acc, order) => {
      acc[order.productId] = (acc[order.productId] || 0) + 1;
      return acc;
    }, {});

  const topProducts = Object.entries(productCounts)
    .map(([id, count]) => ({
      id: parseInt(id),
      name: productsData.find((p) => p.id === parseInt(id))?.name || "Unknown",
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // Top users by purchase count
  const userCounts = ordersData
    .filter((order) => order.status === "completed")
    .reduce((acc, order) => {
      acc[order.userId] = (acc[order.userId] || 0) + 1;
      return acc;
    }, {});

  const topUsers = Object.entries(userCounts)
    .map(([id, count]) => ({
      id: parseInt(id),
      username: usersData.find((u) => u.id === parseInt(id))?.username || "Unknown",
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // Sample 12-month revenue data
  const monthlyRevenueData = [
    500000, 600000, 450000, 700000, 800000, 650000,
    900000, 750000, 820000, 680000, 950000, 1000000,
  ];

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Monthly Revenue (VND)",
        data: monthlyRevenueData,
        backgroundColor: chartType === "bar" ? "rgba(34, 197, 94, 0.6)" : "transparent",
        borderColor: "#22c55e",
        borderWidth: 2,
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#fff",
        pointHoverRadius: 8,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { font: { size: 14 } } },
      title: { display: true, text: "Revenue by Month (2025)", font: { size: 18 } },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => new Intl.NumberFormat("vi-VN").format(value),
        },
      },
    },
  };

  // Pagination logic
  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTotalPages = (data) => Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (section, page) => {
    setCurrentPage((prev) => ({ ...prev, [section]: page }));
  };

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

  // Export data
  const exportToCSV = (data, filename) => {
    const csv = ["ID,Name,Count"];
    data.forEach((item) => csv.push(`${item.id},${item.name},${item.count}`));
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`${styles.adminWrapper} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.adminLayout}>
        <div className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
          <div className={styles.sidebarHeader}>
            <div className={styles.headerContent}>
              {!isSidebarCollapsed && (
                <img src={logo} alt="Logo" className={styles.logo} />
              )}
              <button 
                className={styles.toggleButton}
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                {isSidebarCollapsed ? <FaArrowRight /> : <FaArrowLeft />}
              </button>
            </div>
            {!isSidebarCollapsed && (
              <div className={styles.navLinks}>
                <Link to="/admin" className={navLinkClass("/admin")}>
                  <FaCogs style={{ marginRight: 14 }} /> Trang Chủ
                </Link>
                <Link to="/admin/users" className={navLinkClass("/admin/users")}>
                  <FaUserCog style={{ marginRight: 14 }} /> Quản lý người dùng
                </Link>
                <Link to="/admin/products" className={navLinkClass("/admin/products")}>
                  <FaBoxOpen style={{ marginRight: 14 }} /> Quản lý sản phẩm
                </Link>
                <Link to="/admin/categories" className={navLinkClass("/admin/categories")}>
                  <FaTags style={{ marginRight: 14 }} /> Quản lý danh mục
                </Link>
                <Link to="/admin/orders" className={navLinkClass("/admin/orders")}>
                  <FaClipboardList style={{ marginRight: 14 }} /> Quản lý đơn hàng
                </Link>
                <Link to="/" className={styles.logoutLink}>
                  <FaSignOutAlt style={{ marginRight: 14 }} /> Thoát
                </Link>
              </div>
            )}
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
                    <div className={`${styles.card} ${styles.cardRevenue}`}>
                      <FaChartLine className={styles.cardIcon} />
                      <div>
                        <h4>Doanh thu tháng này</h4>
                        <p>{monthlyRevenue}</p>
                      </div>
                    </div>
                    <div className={`${styles.card} ${styles.cardProducts}`}>
                      <FaBoxOpen className={styles.cardIcon} />
                      <div>
                        <h4>Sản phẩm</h4>
                        <p>{productsData.length} sản phẩm</p>
                      </div>
                    </div>
                    <div className={`${styles.card} ${styles.cardOrders}`}>
                      <FaClipboardList className={styles.cardIcon} />
                      <div>
                        <h4>Đơn hàng</h4>
                        <p>{ordersData.length} đơn</p> {/* Updated to use fetched orders */}
                      </div>
                    </div>
                    <div className={`${styles.card} ${styles.cardUsers}`}>
                      <FaUserCog className={styles.cardIcon} />
                      <div>
                        <h4>Người dùng</h4>
                        <p>{usersData.length} người</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.actionsSection}>
                    <h3>Thao tác nhanh</h3>
                    <div className={styles.actionsContainer}>
                      <Link to="/admin/products" className={styles.actionButton}>
                        <FaPlus /> Thêm sản phẩm
                      </Link>
                      <Link to="/admin/orders" className={styles.actionButton}>
                        <FaClipboardList /> Xem đơn hàng chờ
                      </Link>
                      <button
                        className={styles.actionButton}
                        onClick={() => exportToCSV(topProducts, "top_products")}
                      >
                        <FaFileExport /> Xuất dữ liệu
                      </button>
                    </div>
                  </div>

                  <div className={styles.tablesContainer}>
                    <div className={styles.cardTable}>
                      <h3>Top sản phẩm được mua nhiều nhất</h3>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Tên sản phẩm</th>
                            <th>Số lần mua</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getPaginatedData(topProducts, currentPage.topProducts).map((product) => (
                            <tr key={product.id}>
                              <td>{product.id}</td>
                              <td>{product.name}</td>
                              <td>{product.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {renderPagination("topProducts", getTotalPages(topProducts))}
                    </div>

                    <div className={styles.cardTable}>
                      <h3>Top người dùng mua nhiều nhất</h3>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Số đơn hàng</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getPaginatedData(topUsers, currentPage.topUsers).map((user) => (
                            <tr key={user.id}>
                              <td>{user.id}</td>
                              <td>{user.username}</td>
                              <td>{user.count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {renderPagination("topUsers", getTotalPages(topUsers))}
                    </div>
                  </div>

                  <div className={styles.chartSection}>
                    <div className={styles.chartHeader}>
                      <h3>Doanh thu 12 tháng</h3>
                      <div className={styles.chartToggle}>
                        <button
                          className={`${styles.toggleButton} ${chartType === "bar" ? styles.activeToggle : ""}`}
                          onClick={() => setChartType("bar")}
                        >
                          Bar
                        </button>
                        <button
                          className={`${styles.toggleButton} ${chartType === "line" ? styles.activeToggle : ""}`}
                          onClick={() => setChartType("line")}
                        >
                          Line
                        </button>
                      </div>
                    </div>
                    <div className={styles.chartContainer}>
                      {chartType === "bar" ? (
                        <Bar data={chartData} options={chartOptions} />
                      ) : (
                        <Line data={chartData} options={chartOptions} />
                      )}
                    </div>
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