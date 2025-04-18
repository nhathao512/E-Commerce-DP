import React, { useState, useEffect, useContext } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
import { AuthContext } from "../../context/AuthContext";
import UsersPage from "./manageuser/UserManagement";
import ProductsPage from "./manageproduct/ProductManagement";
import CategoriesPage from "./managecategories/CategoriesManagement";
import OrderPage from "./manageorder/OrderManagement";
import styles from "./AdminPage.module.css";
import logo from "../../assets/logo1.png";
import {
  getProducts,
  getAllOrders,
  exportTopProducts,
  exportTopUsers,
} from "../../services/api";
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
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [chartType, setChartType] = useState("bar");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 1)) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProductsData(response.data || []);
      } catch {
        setError("Không thể tải dữ liệu sản phẩm.");
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/auth/users"
        );
        setUsersData(response.data || []);
      } catch {
        setError("Không thể tải dữ liệu người dùng.");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        setOrdersData(response.data || []);
      } catch {
        setError("Không thể tải dữ liệu đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const navLinkClass = (path) =>
    `${location.pathname === path ? styles.activeLink : ""}`;

  const monthlyRevenue = ordersData
    .filter((order) => order.status === "Hoàn thành")
    .reduce((sum, order) => sum + order.total, 0)
    .toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const { productCounts, userCounts } = ordersData
    .filter((order) => order.status === "Hoàn thành")
    .reduce(
      (acc, order) => {
        const userId = String(order.userId);
        acc.userCounts[userId] = (acc.userCounts[userId] || 0) + 1;
        order.items.forEach((item) => {
          const productName = item.productName || "Unknown Product";
          if (productName) {
            if (!acc.productCounts[productName]) {
              acc.productCounts[productName] = { name: productName, count: 0 };
            }
            acc.productCounts[productName].count += item.quantity || 1;
          }
        });
        return acc;
      },
      { productCounts: {}, userCounts: {} }
    );

  const topProducts = Object.values(productCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topUsers = Object.entries(userCounts)
    .map(([id, count]) => {
      const user = usersData.find((u) => String(u.id) === String(id));
      return {
        id,
        username: user?.username || "Unknown",
        fullName: user?.fullName || user?.username || "N/A",
        count,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const monthlyRevenueData = Array(12).fill(0);
  ordersData
    .filter((order) => order.status === "Hoàn thành")
    .forEach((order) => {
      const createdAt = order.createdAt;
      if (createdAt) {
        const month = new Date(createdAt).getMonth();
        monthlyRevenueData[month] += order.total;
      }
    });

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Doanh thu hàng tháng (VND)",
        data: monthlyRevenueData,
        backgroundColor: "#22c55e",
        borderColor: "#22c55e",
        borderWidth: 2,
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#ffffff",
        pointHoverRadius: 8,
        pointRadius: 5,
        pointHoverBackgroundColor: "#16a34a",
        tension: 0.4,
        fill: chartType === "line",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Doanh thu 12 tháng (2025)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) =>
            new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value),
        },
      },
    },
  };

  // Hàm gọi API xuất dữ liệu
  const exportData = async (type, format) => {
    try {
      const response =
        type === "top-products"
          ? await exportTopProducts(format)
          : await exportTopUsers(format);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Lỗi khi xuất ${type} dưới dạng ${format}:`, error);
      const errorMessage =
        error.response?.status === 401
          ? "Bạn cần đăng nhập với quyền admin để xuất dữ liệu."
          : `Không thể xuất dữ liệu ${type}. Vui lòng thử lại.`;
      setError(errorMessage);
    }
  };

  if (isLoading || loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }
  if (error) {
    return (
      <div className={styles.error}>
        Lỗi: {error}
        <button
          className={styles.actionButton}
          onClick={() => setError("")}
          style={{ marginTop: "10px" }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div
      className={`${styles.adminWrapper} ${
        isSidebarCollapsed ? styles.collapsed : ""
      }`}
    >
      <div className={styles.adminLayout}>
        <div
          className={`${styles.sidebar} ${
            isSidebarCollapsed ? styles.collapsed : ""
          }`}
        >
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
                <Link
                  to="/admin/users"
                  className={navLinkClass("/admin/users")}
                >
                  <FaUserCog style={{ marginRight: 14 }} /> Quản lý người dùng
                </Link>
                <Link
                  to="/admin/products"
                  className={navLinkClass("/admin/products")}
                >
                  <FaBoxOpen style={{ marginRight: 14 }} /> Quản lý sản phẩm
                </Link>
                <Link
                  to="/admin/categories"
                  className={navLinkClass("/admin/categories")}
                >
                  <FaTags style={{ marginRight: 14 }} /> Quản lý danh mục
                </Link>
                <Link
                  to="/admin/orders"
                  className={navLinkClass("/admin/orders")}
                >
                  <FaClipboardList style={{ marginRight: 14 }} /> Quản lý đơn
                  hàng
                </Link>
                <Link to="/" className={navLinkClass("/")}>
                  <FaSignOutAlt style={{ marginRight: 14 }} /> Thoát
                </Link>
              </div>
            )}
          </div>
        </div>

        <main className={styles.main}>
          <div className={styles.header}>
            <h2>Chào {user?.username || "Admin"}!</h2>
          </div>
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
                        <p>{ordersData.length} đơn</p>
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
                      <div className={styles.exportButtonGroup}>
                        <button
                          className={styles.actionButton}
                          onClick={() => exportData("top-products", "csv")}
                        >
                          <FaFileExport /> Xuất top sản phẩm (CSV)
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => exportData("top-products", "json")}
                        >
                          <FaFileExport /> Xuất top sản phẩm (JSON)
                        </button>
                      </div>
                      <div className={styles.exportButtonGroup}>
                        <button
                          className={styles.actionButton}
                          onClick={() => exportData("top-users", "csv")}
                        >
                          <FaFileExport /> Xuất top người dùng (CSV)
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => exportData("top-users", "json")}
                        >
                          <FaFileExport /> Xuất top người dùng (JSON)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.tablesContainer}>
                    {productsData.length > 0 ? (
                      <div className={styles.cardTable}>
                        <h3>Top sản phẩm được mua nhiều nhất</h3>
                        {topProducts.length > 0 ? (
                          <table className={styles.table}>
                            <thead>
                              <tr>
                                <th>Tên sản phẩm</th>
                                <th>Số lần mua</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topProducts.map((product) => (
                                <tr key={product.name}>
                                  <td>{product.name}</td>
                                  <td>{product.count}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>Không có dữ liệu sản phẩm được mua.</p>
                        )}
                      </div>
                    ) : (
                      <p>Đang tải dữ liệu sản phẩm...</p>
                    )}

                    {usersData.length > 0 ? (
                      <div className={styles.cardTable}>
                        <h3>Top người dùng mua nhiều nhất</h3>
                        {topUsers.length > 0 ? (
                          <table className={styles.table}>
                            <thead>
                              <tr>
                                <th>Username</th>
                                <th>Tên người dùng</th>
                                <th>Số đơn hàng</th>
                              </tr>
                            </thead>
                            <tbody>
                              {topUsers.map((user) => (
                                <tr key={user.id}>
                                  <td>{user.username}</td>
                                  <td>{user.fullName}</td>
                                  <td>{user.count}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>Không có dữ liệu người dùng mua hàng.</p>
                        )}
                      </div>
                    ) : (
                      <p>Đang tải dữ liệu người dùng...</p>
                    )}
                  </div>

                  <div className={styles.chartSection}>
                    <div className={styles.chartHeader}>
                      <h3>Doanh thu 12 tháng</h3>
                      <div className={styles.chartToggle}>
                        <button
                          className={`${styles.toggleButton} ${
                            chartType === "bar" ? styles.activeToggle : ""
                          }`}
                          onClick={() => setChartType("bar")}
                        >
                          Bar
                        </button>
                        <button
                          className={`${styles.toggleButton} ${
                            chartType === "line" ? styles.activeToggle : ""
                          }`}
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
