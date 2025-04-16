import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getOrdersByUserId } from "../../services/api";
import styles from "./UserOrderManagement.module.css";
import { FaList } from "react-icons/fa";

const UserOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useContext(AuthContext);

  // Hàm ánh xạ trạng thái từ admin sang người dùng
  const mapStatusForUser = (adminStatus) => {
    switch (adminStatus) {
      case "Xác nhận":
        return "Chờ xác nhận";
      case "Giao hàng":
        return "Đang giao hàng";
      case "Hủy":
        return "Đã hủy";
      case "Hoàn thành":
        return "Thành công";
      default:
        return adminStatus || "Chờ xác nhận"; // Mặc định nếu không xác định
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user) {
        setError("Vui lòng đăng nhập để xem đơn hàng!");
        setLoading(false);
        return;
      }

      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          throw new Error("Không tìm thấy userId!");
        }

        const response = await getOrdersByUserId(userId);
        const ordersData = response.data.map((order) => ({
          id: order.id,
          status: mapStatusForUser(order.status), // Ánh xạ trạng thái
          items: order.items.map((item) => ({
            name: item.productName,
            quantity: item.quantity,
            imageUrl:
              item.imageUrl ||
              `https://placehold.co/50x50?text=${encodeURIComponent(
                item.productName
              )}`,
          })),
        }));
        setOrders(ordersData);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(
          err.response?.status === 404
            ? "Không tìm thấy đơn hàng nào cho người dùng này."
            : "Không thể tải danh sách đơn hàng. Vui lòng thử lại sau!"
        );
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchOrders();
    }
  }, [isAuthenticated, user, authLoading]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Thành công":
        return styles.statusGreen;
      case "Đang giao hàng": // Cập nhật để khớp với trạng thái người dùng
        return styles.statusYellow;
      case "Đã hủy":
        return styles.statusRed;
      case "Chờ xác nhận":
        return styles.statusGray;
      default:
        return "";
    }
  };

  const canRate = (status) => status === "Thành công" || status === "Đã hủy";
  const canRepurchase = (status) =>
    status === "Thành công" || status === "Đã hủy";

  if (authLoading || loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <FaList /> Quản lý đơn hàng
      </h2>

      {orders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <table className={styles.orderTable}>
          <thead className={styles.gradientRow}>
            <tr>
              <th>Mã đơn</th>
              <th>Sản phẩm</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  <div className={styles.productCell}>
                    {order.items[0] ? (
                      <>
                        <img
                          src={order.items[0].imageUrl}
                          alt={order.items[0].name}
                          className={styles.productImage}
                        />
                        <span>{order.items[0].name}</span>
                      </>
                    ) : (
                      "Không có sản phẩm"
                    )}
                  </div>
                </td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.actionBtn}
                    onClick={() => setSelectedOrder(order)}
                  >
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>Chi tiết đơn hàng</h3>
            <table className={styles.detailTable}>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>SL</th>
                  <th>Actions</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <div className={styles.popupButtons}>
                        <button
                          className={styles.actionBtn}
                          disabled={
                            !canRate(selectedOrder.status) ||
                            selectedOrder.status === "Đã hủy"
                          }
                        >
                          Đánh giá
                        </button>
                        <button
                          className={styles.actionBtn}
                          disabled={!canRepurchase(selectedOrder.status)}
                        >
                          Mua lại
                        </button>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${getStatusClass(
                          selectedOrder.status
                        )}`}
                      >
                        {selectedOrder.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className={styles.closeBtn}
              onClick={() => setSelectedOrder(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderManagement;
