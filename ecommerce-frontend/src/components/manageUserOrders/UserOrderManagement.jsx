import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getOrdersByUserId } from "../../services/api";
import ReviewForm from "../review/ReviewForm";
import styles from "./UserOrderManagement.module.css";
import { FaList } from "react-icons/fa";
import noOrdersImage from "../../assets/emptyorder.png";

const UserOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
  } = useContext(AuthContext);

  const mapStatusForUser = (adminStatus) => {
    switch (adminStatus) {
      case "Xác nhận":
        return "Xác nhận";
      case "Đang xử lý":
        return "Đang xử lý";
      case "Giao hàng":
        return "Đang giao hàng";
      case "Hoàn thành":
        return "Thành công";
      case "Hủy":
        return "Đã hủy";
      case "Trả hàng":
        return "Đã trả hàng";
      default:
        return adminStatus || "Không rõ";
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
          status: mapStatusForUser(order.status),
          total: order.total,
          createdAt: new Date(order.createdAt).toLocaleDateString("vi-VN"),
          items: order.items.map((item) => ({
            name: item.productName || "Sản phẩm không xác định",
            quantity: item.quantity,
            imageUrl:
              item.imageUrl ||
              `https://placehold.co/50x50?text=${encodeURIComponent(
                item.productName || "Sản phẩm"
              )}`,
            productCode: item.productCode,
            price: item.price,
            size: item.size,
          })),
          cancelReason: order.cancelReason || "",
          name: order.name || "Không xác định",
          phone: order.phone || "Không xác định",
          address: order.address || "Không xác định",
        }));
        setOrders(ordersData);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
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
      case "Đang giao hàng":
      case "Đang xử lý":
        return styles.statusYellow;
      case "Đã hủy":
      case "Đã trả hàng":
        return styles.statusRed;
      case "Xác nhận":
        return styles.statusGreen;
      default:
        return "";
    }
  };

  const canRate = (status) => status === "Thành công";

  const handleRateClick = (item) => {
    if (!item.productCode || item.productCode === "UNKNOWN") {
      console.error("Mã sản phẩm không hợp lệ:", item);
      alert("Không thể đánh giá: Mã sản phẩm không hợp lệ!");
      return;
    }
    setShowReviewForm(item);
  };

  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

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
        <div className={styles.noOrders}>
          <img
            src={noOrdersImage}
            alt="Không có đơn hàng"
            className={styles.noOrdersImage}
          />
        </div>
      ) : (
        <>
          <table className={styles.orderTable}>
            <thead className={styles.gradientRow}>
              <tr>
                <th>Mã đơn</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Ngày đặt</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
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
                  <td>{order.total.toLocaleString("vi-VN")} VNĐ</td>
                  <td>{order.createdAt}</td>
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

          <div className={styles.pagination}>
            <button
              className={styles.paginationBtn}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`${styles.paginationBtn} ${
                  currentPage === index + 1 ? styles.activePage : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className={styles.paginationBtn}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Sau
            </button>
          </div>
        </>
      )}

      {selectedOrder && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h3>Chi tiết đơn hàng</h3>
              <div className={styles.userInfo}>
                <p>
                  <strong>Tên:</strong> {selectedOrder.name}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {selectedOrder.phone}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {selectedOrder.address}
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{" "}
                  {selectedOrder.total.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>

              {selectedOrder.cancelReason &&
                selectedOrder.status === "Đã hủy" && (
                  <p className={styles.cancelReason}>
                    Lý do hủy: {selectedOrder.cancelReason}
                  </p>
                )}
              <table className={styles.detailTable}>
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>SL</th>
                    <th>Kích thước</th>
                    <th>Giá</th>
                    <th>Thao tác</th>
                    <th className={styles.statusColumn}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.size || "N/A"}</td>
                      <td>
                        {item.price?.toLocaleString("vi-VN") || "N/A"} VNĐ
                      </td>
                      <td>
                        <div className={styles.popupButtons}>
                          <button
                            className={styles.actionBtn}
                            onClick={() => handleRateClick(item)}
                            disabled={
                              !canRate(selectedOrder.status) ||
                              !item.productCode
                            }
                          >
                            Đánh giá
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
            </div>
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedOrder(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {showReviewForm && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3>Đánh giá sản phẩm: {showReviewForm.name}</h3>
            <ReviewForm
              productCode={showReviewForm.productCode}
              onClose={() => setShowReviewForm(null)}
            />
            <button
              className={styles.closeBtn}
              onClick={() => setShowReviewForm(null)}
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
