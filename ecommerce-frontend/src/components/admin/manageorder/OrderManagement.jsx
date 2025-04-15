import React, { useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import styles from "./OrderManagement.module.css";
import { ShoppingCart } from "lucide-react";

function OrderManagement() {
  const [orders, setOrders] = useState([
    {
      id: "O001",
      userId: "U123",
      items: "P001 x1, P002 x2",
      total: 300,
      paymentMethod: "Credit Card",
    },
    {
      id: "O002",
      userId: "U456",
      items: "P003 x1",
      total: 150,
      paymentMethod: "PayPal",
    },
  ]);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const handleDelete = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setPopupOpen(true);
  };

  const handleCreate = () => {
    setEditingOrder(null);
    setPopupOpen(true);
  };

  const handleSave = (newOrder) => {
    if (editingOrder) {
      setOrders(orders.map((o) => (o.id === newOrder.id ? newOrder : o)));
    } else {
      setOrders([...orders, { ...newOrder, id: `O${Date.now()}` }]);
    }
    setPopupOpen(false);
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
    { key: "items", label: "Mặt hàng" },
    { key: "total", label: "Tổng tiền" },
    { key: "paymentMethod", label: "Phương thức thanh toán" },
  ];

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
            <h2>{editingOrder ? "Sửa đơn hàng" : "Tạo đơn hàng mới"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const newOrder = {
                  id: editingOrder?.id || null,
                  userId: form.userId.value,
                  items: form.items.value,
                  total: parseFloat(form.total.value) || 0,
                  paymentMethod: form.paymentMethod.value,
                };
                handleSave(newOrder);
              }}
              className={styles.form}
            >
              <div className={styles.formGroup}>
                <label>ID người dùng:</label>
                <input
                  name="userId"
                  defaultValue={editingOrder?.userId || ""}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Mặt hàng:</label>
                <input
                  name="items"
                  defaultValue={editingOrder?.items || ""}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tổng tiền:</label>
                <input
                  name="total"
                  type="number"
                  defaultValue={editingOrder?.total || 0}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phương thức thanh toán:</label>
                <input
                  name="paymentMethod"
                  defaultValue={editingOrder?.paymentMethod || ""}
                  required
                />
              </div>
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