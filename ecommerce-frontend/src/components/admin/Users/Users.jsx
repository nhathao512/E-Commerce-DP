// src/components/admin/Users/Users.jsx
import React, { useState } from "react";
import styles from "./Users.module.css";

function Users() {
    const [users, setUsers] = useState([
        { id: 1, username: "user1", email: "user1@example.com", role: "user" },
        { id: 2, username: "admin1", email: "admin1@example.com", role: "admin" },
    ]);
    const [newUser, setNewUser] = useState({ username: "", email: "", role: "user" });

    // Thêm người dùng
    const addUser = () => {
        if (newUser.username.trim() === "" || newUser.email.trim() === "") return;
        setUsers([...users, { id: Date.now(), ...newUser }]);
        setNewUser({ username: "", email: "", role: "user" });
    };

    // Sửa người dùng
    const editUser = (id) => {
        const userToEdit = users.find((user) => user.id === id);
        const newUsername = prompt("Nhập tên người dùng mới:", userToEdit.username);
        const newEmail = prompt("Nhập email mới:", userToEdit.email);
        const newRole = prompt("Nhập vai trò mới (user/admin):", userToEdit.role);
        if (newUsername && newEmail) {
            setUsers(
                users.map((user) =>
                    user.id === id
                        ? { ...user, username: newUsername, email: newEmail, role: newRole || user.role }
                        : user
                )
            );
        }
    };

    // Xóa người dùng
    const deleteUser = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
            setUsers(users.filter((user) => user.id !== id));
        }
    };

    return (
        <div className={styles.container}>
            <h1>Quản lý tài khoản người dùng</h1>

            {/* Form thêm người dùng */}
            <div className={styles.form}>
                <input
                    type="text"
                    placeholder="Tên người dùng"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
                <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button onClick={addUser}>Thêm người dùng</button>
            </div>

            {/* Bảng danh sách người dùng */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên người dùng</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button
                                    className={styles.editBtn}
                                    onClick={() => editUser(user.id)}
                                >
                                    Sửa
                                </button>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => deleteUser(user.id)}
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

export default Users;