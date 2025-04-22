import React, { useState, useEffect } from "react";
import Dashboard from "../dashboard/Dashboard";
import styles from "./OrderManagement.module.css";
import { ShoppingCart } from "lucide-react";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../../services/api";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter((order) => order.id !== id));
    } catch (err) {
      console.error("Failed to delete order:", err);
      alert("Không thể xóa đơn hàng. Vui lòng thử lại sau!");
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setPopupOpen(true);
  };

  const handleCreate = () => {
    alert(
      "Tạo mới đơn hàng không được hỗ trợ trực tiếp. Vui lòng sử dụng trang Thanh toán!"
    );
  };

  const handleSave = async (status, cancelReason = "") => {
    try {
      if (editingOrder) {
        await updateOrderStatus(editingOrder.id, status, cancelReason);
        setOrders(
          orders.map((o) =>
            o.id === editingOrder.id ? { ...o, status, cancelReason } : o
          )
        );
        setPopupOpen(false);
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau!");
    }
  };

  const filteredData = [...orders]
    .filter((order) =>
      order.userId.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? a.userId.localeCompare(b.userId)
        : b.userId.localeCompare(a.userId)
    );

  const columns = [
    { key: "id", label: "ID đơn hàng" },
    { key: "userId", label: "ID người dùng" },
    {
      key: "items",
      label: "Mặt hàng",
      render: (order) =>
        order.items
          ?.map((item) => `${item.productName} x${item.quantity}`)
          .join(", ") || "Không có sản phẩm",
    },
    { key: "total", label: "Tổng tiền" },
    { key: "paymentMethod", label: "Phương thức thanh toán" },
    {
      key: "status",
      label: "Trạng thái",
      render: (order) => order.status || "Xác nhận",
    },
  ];

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <ShoppingCart style={{ marginRight: "0.5rem" }} /> QUẢN LÝ ĐƠN HÀNG
        </h1>
      </div>

      <div className={styles.searchBar}>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Tìm kiếm theo ID người dùng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleCreate}>Tạo mới</button>
          <button onClick={() => setSortAsc(!sortAsc)}>
            {sortAsc ? "⬇ DESC" : "⬆ ASC"}
          </button>
        </div>
      </div>

      <Dashboard
        columns={columns}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {popupOpen && (
        <div className={styles.overlay} onClick={() => setPopupOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Cập nhật trạng thái đơn hàng</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const status = e.target.status.value;
                const cancelReason = e.target.cancelReason?.value || "";
                handleSave(status, cancelReason);
              }}
              className={styles.form}
            >
              <div className={styles.formGroup}>
                <label>Trạng thái:</label>
                <select
                  name="status"
                  defaultValue={editingOrder?.status || "Đang xử lý"}
                  required
                >
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Xác nhận">Xác nhận</option>
                  <option value="Giao hàng">Giao hàng</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Hủy">Hủy</option>
                  <option value="Trả hàng">Trả hàng</option>
                </select>
              </div>
              {editingOrder?.status === "Hủy" && (
                <div className={styles.formGroup}>
                  <label>Lý do hủy:</label>
                  <textarea
                    name="cancelReason"
                    defaultValue={editingOrder?.cancelReason || ""}
                    placeholder="Nhập lý do hủy đơn hàng"
                  />
                </div>
              )}
              <div className={styles.buttonGroup}>
                <button type="submit">Lưu</button>
                <button type="button" onClick={() => setPopupOpen(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
