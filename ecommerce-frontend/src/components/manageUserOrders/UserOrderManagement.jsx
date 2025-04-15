import React, { useState } from "react";
import styles from "./UserOrderManagement.module.css";
import { FaClipboardList } from "react-icons/fa";

const ordersData = [
  {
    id: 1,
    status: "Thành công",
    items: [
      { name: "Balo", quantity: 2, imageUrl: "https://via.placeholder.com/50?text=Balo" },
      { name: "Giày", quantity: 1, imageUrl: "https://via.placeholder.com/50?text=Giày" },
    ],
  },
  {
    id: 2,
    status: "Đang giao",
    items: [
      { name: "Mũ", quantity: 1, imageUrl: "https://via.placeholder.com/50?text=Mũ" },
    ],
  },
  {
    id: 3,
    status: "Đã hủy",
    items: [
      { name: "Áo khoác", quantity: 1, imageUrl: "https://via.placeholder.com/50?text=Áo+khoác" },
    ],
  },
];

const UserOrderManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusClass = (status) => {
    switch (status) {
      case "Thành công":
        return styles.statusGreen;
      case "Đang giao":
        return styles.statusYellow;
      case "Đã hủy":
        return styles.statusRed;
      default:
        return "";
    }
  };

  const canRate = (status) => status === "Thành công" || status === "Đã hủy";
  const canRepurchase = (status) => status === "Thành công" || status === "Đã hủy";

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <FaClipboardList /> Quản lý đơn hàng
      </h2>

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
          {ordersData.map((order) => (
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
                <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
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
                          disabled={!canRate(selectedOrder.status) || selectedOrder.status === "Đã hủy"}
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
                      <span className={`${styles.statusBadge} ${getStatusClass(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className={styles.closeBtn} onClick={() => setSelectedOrder(null)}>
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderManagement;