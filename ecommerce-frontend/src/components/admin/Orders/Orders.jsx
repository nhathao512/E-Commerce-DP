// src/components/admin/Orders/Orders.jsx
import React, { useState } from "react";
import styles from "./Orders.module.css";

function Orders() {
    const [orders, setOrders] = useState([
        { id: 1, customer: "user1", total: 1500000, status: "Pending" },
        { id: 2, customer: "user2", total: 2500000, status: "Shipped" },
    ]);

    // Cập nhật trạng thái đơn hàng
    const updateStatus = (id) => {
        const orderToUpdate = orders.find((order) => order.id === id);
        const newStatus = prompt("Nhập trạng thái mới (Pending/Shipped/Delivered):", orderToUpdate.status);
        if (newStatus) {
            setOrders(
                orders.map((order) =>
                    order.id === id ? { ...order, status: newStatus } : order
                )
            );
        }
    };

    // Xóa đơn hàng
    const deleteOrder = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa đơn hàng này?")) {
            setOrders(orders.filter((order) => order.id !== id));
        }
    };

    return (
        <div className={styles.container}>
            <h1>Quản lý đơn hàng</h1>

            {/* Bảng danh sách đơn hàng */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Khách hàng</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.total.toLocaleString()} VNĐ</td>
                            <td>{order.status}</td>
                            <td>
                                <button
                                    className={styles.editBtn}
                                    onClick={() => updateStatus(order.id)}
                                >
                                    Cập nhật
                                </button>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => deleteOrder(order.id)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Orders;