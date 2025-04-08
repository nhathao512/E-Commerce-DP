// src/components/admin/Dashboard/Dashboard.jsx
import React from "react";
import styles from "./Dashboard.module.css";


function Dashboard() {
    return (
        <div className={styles.container}>
            <h1>Trang Quản Trị</h1>
            <div className={styles.dashboard}>
                <div className={styles.card}>Tổng sản phẩm: 150</div>
                <div className={styles.card}>Đơn hàng mới: 25</div>
                <div className={styles.card}>Người dùng: 300</div>
            </div>
        </div>
    );
}

export default Dashboard;