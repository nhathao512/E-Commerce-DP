import React, { useState } from "react";
import Dashboard from "../Dashboard/Dashboard";
import styles from "./OrderManagement.module.css"; // Dùng lại CSS
import { ShoppingCart } from "lucide-react";
import Header from "../Header";

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
      <h1><ShoppingCart /> Quản lý đơn hàng</h1>
      <div className={styles.controls}>
        <button onClick={handleCreate}>➕ Tạo mới</button>
        <button onClick={() => setSortAsc(!sortAsc)}>
          {sortAsc ? "⬇ DESC" : "⬆ ASC"}
        </button>
        <input
          type="text"
          placeholder="🔍 Tìm theo User ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Dashboard
        title="Danh sách đơn hàng"
        columns={columns}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {popupOpen && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>{editingOrder ? "Sửa đơn hàng" : "Tạo đơn hàng mới"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const newOrder = {
                  id: editingOrder?.id || null,
                  userId: form.userId.value,
                  items: form.items.value,
                  total: parseFloat(form.total.value),
                  paymentMethod: form.paymentMethod.value,
                };
                handleSave(newOrder);
              }}
            >
              <input name="userId" placeholder="ID người dùng" defaultValue={editingOrder?.userId || ""} />
              <input name="items" placeholder="Mặt hàng (VD: P001 x2, P002 x1)" defaultValue={editingOrder?.items || ""} />
              <input name="total" placeholder="Tổng tiền" type="number" defaultValue={editingOrder?.total || 0} />
              <input name="paymentMethod" placeholder="Phương thức thanh toán" defaultValue={editingOrder?.paymentMethod || ""} />
              <div className={styles.popupButtons}>
                <button type="submit">💾 Lưu</button>
                <button type="button" onClick={() => setPopupOpen(false)}>❌ Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
