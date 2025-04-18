import React, { useState, useEffect, useContext } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
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
  FaOutdent,
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
import { getProducts, getAllOrders } from "../../services/api";
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
  const { user, isAuthenticated, isLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [chartType, setChartType] = useState("bar");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Kiểm tra quyền truy cập admin
  useEffect(() => {
    console.log("Checking admin access:", {
      isLoading,
      isAuthenticated,
      user: user ? { username: user.username, role: user.role } : null,
    });
    if (!isLoading) {
      if (!isAuthenticated || !user || user.role !== 1) {
        console.log("Unauthorized access to /admin, redirecting to /");
        navigate("/", { replace: true });
      } else {
        console.log("Authorized admin access, role:", user.role);
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);

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
            id: product.id || "N/A",
            productCode: product.productCode || "N/A",
            images: Array.isArray(product.images) ? product.images : [],
          }));
        setProductsData(validProducts);
        console.log("Fetched products:", validProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Không thể tải dữ liệu sản phẩm.");
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
        console.log("Fetched users:", response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Không thể tải dữ liệu người dùng.");
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
        console.log("Fetched orders:", response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Không thể tải dữ liệu đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const navLinkClass = (path) =>
    `${location.pathname === path ? styles.activeLink : ""}`;

  // Calculate monthly revenue
  const monthlyRevenue = ordersData
    .filter((order) => order.status === "Hoàn thành")
    .reduce((sum, order) => sum + order.total, 0)
    .toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  // Top products and users
  const { productCounts, userCounts } = ordersData
    .filter((order) => order.status === "Hoàn thành")
    .reduce(
      (acc, order) => {
        const userId = String(order.userId);
        acc.userCounts[userId] = (acc.userCounts[userId] || 0) + 1;
        if (!usersData.find((u) => String(u.id) === userId)) {
          console.warn(`User ID ${userId} not found in usersData`);
        }

        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item, index) => {
            const productName = item.productName || "Unknown Product";
            console.log(`Order ${order.id}, item ${index}:`, item);
            if (productName) {
              if (!acc.productCounts[productName]) {
                acc.productCounts[productName] = {
                  name: productName,
                  count: 0,
                };
              }
              acc.productCounts[productName].count += item.quantity || 1;
            } else {
              console.warn(`Invalid item in order ${order.id}:`, item);
            }
          });
        } else {
          console.warn(`Order ${order.id} missing items:`, order);
        }
        return acc;
      },
      { productCounts: {}, userCounts: {} }
    );

  console.log("Product counts:", productCounts);
  console.log("User counts:", userCounts);

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

  // Monthly revenue chart data
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

  // Gradient for chart
  const createGradient = (ctx, chartArea) => {
    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, "rgba(34, 197, 94, 0.2)");
    gradient.addColorStop(1, "rgba(34, 197, 94, 0.8)");
    return gradient;
  };

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
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(34, 197, 94, 0.6)";
          return chartType === "bar" ? createGradient(ctx, chartArea) : "transparent";
        },
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
      legend: {
        position: "top",
        labels: {
          font: { size: 14, weight: "500" },
          color: "#1e293b",
        },
      },
      title: {
        display: true,
        text: "Doanh thu 12 tháng (2025)",
        font: { size: 20, weight: "600" },
        color: "#1e293b",
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(context.parsed.y)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#4b5563",
          font: { size: 12 },
          callback: (value) =>
            new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
              minimumFractionDigits: 0,
            }).format(value),
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        ticks: {
          color: "#4b5563",
          font: { size: 12 },
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  // Export data
  const exportToCSV = (data, filename) => {
    const csv = filename.includes("users")
      ? ["Username,FullName,Count"]
      : ["Name,Count"];
    data.forEach((item) =>
      csv.push(
        filename.includes("users")
          ? `${item.username},${item.fullName},${item.count}`
          : `${item.name},${item.count}`
      )
    );
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle logout
  const handleLogout = () => {
    console.log("Admin logging out, redirecting to /login");
    logout();
    navigate("/login", { replace: true });
  };

  // Render loading or error state
  if (isLoading || loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }
  if (error) {
    return <div className={styles.error}>Lỗi: {error}</div>;
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
                <Link to="/admin/users" className={navLinkClass("/admin/users")}>
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
                  <Link
                    to="/"
                    className={navLinkClass("/")}
                  >
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
                      <Link
                        to="/admin/products"
                        className={styles.actionButton}
                      >
                        <FaPlus /> Thêm sản phẩm
                      </Link>
                      <Link to="/admin/orders" className={styles.actionButton}>
                        <FaClipboardList /> Xem đơn hàng chờ
                      </Link>
                      <button
                        className={styles.actionButton}
                        onClick={() =>
                          exportToCSV(topProducts, "top_products")
                        }
                      >
                        <FaFileExport /> Xuất dữ liệu sản phẩm
                      </button>
                      <button
                        className={styles.actionButton}
                        onClick={() => exportToCSV(topUsers, "top_users")}
                      >
                        <FaFileExport /> Xuất dữ liệu người dùng
                      </button>
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
                          <p>Không có dữ liệu sản phẩm được mua. Vui lòng kiểm tra đơn hàng.</p>
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
                          <p>Không có dữ liệu người dùng mua hàng. Vui lòng kiểm tra đơn hàng.</p>
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