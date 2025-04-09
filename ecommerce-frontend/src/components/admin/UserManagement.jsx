import React, { useState } from "react";
import styles from "./UserManagement.module.css";

const initialUsers = [
  { id: 1, username: "viet", password: "admin123" },
  { id: 2, username: "hao", password: "admin123" },
];

function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formUser, setFormUser] = useState({ id: null, username: "", password: "" });
  const [filterOrder, setFilterOrder] = useState(null); // "asc", "desc", or null

  const filteredUsers = users
    .filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (filterOrder === "asc") return a.id - b.id;
      if (filterOrder === "desc") return b.id - a.id;
      return 0;
    });

  const openCreateForm = () => {
    setIsEditing(false);
    const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    setFormUser({ id: newId, username: "", password: "" });
    setShowForm(true);
  };

  const openEditForm = (user) => {
    setIsEditing(true);
    setFormUser(user);
    setShowForm(true);
  };

  const handleSave = () => {
    if (formUser.username.trim() && formUser.password.trim()) {
      if (isEditing) {
        setUsers((prev) =>
          prev.map((u) => (u.id === formUser.id ? formUser : u))
        );
      } else {
        setUsers([...users, formUser]);
      }
      setShowForm(false);
      setFormUser({ id: null, username: "", password: "" });
    }
  };

  const handleDeleteUser = (id) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa người dùng này?");
    if (confirmed) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const toggleFilter = () => {
    if (filterOrder === null) setFilterOrder("asc");
    else if (filterOrder === "asc") setFilterOrder("desc");
    else setFilterOrder(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Search user..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className={styles.actions}>
          <button onClick={toggleFilter}>
            {filterOrder === "asc"
              ? "ID ↑"
              : filterOrder === "desc"
              ? "ID ↓"
              : "ADD FILTER"}
          </button>
          <button onClick={openCreateForm}>+ CREATE</button>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Username</th>
            <th>Password</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td className={styles.link}>{u.username}</td>
                <td>{u.password}</td>
                <td>
                  <button className={styles.editBtn} onClick={() => openEditForm(u)}>✏ EDIT</button>
                  <button className={styles.deleteBtn} onClick={() => handleDeleteUser(u.id)}>🗑 DELETE</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", color: "#888" }}>
                Không tìm thấy người dùng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Popup Create/Edit Form */}
      {showForm && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h3>{isEditing ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</h3>

            <input
              type="text"
              value={`ID: ${formUser.id}`}
              disabled
              style={{ backgroundColor: "#f0f0f0", fontWeight: "bold" }}
            />

            <input
              type="text"
              placeholder="Username"
              value={formUser.username}
              onChange={(e) => setFormUser({ ...formUser, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={formUser.password}
              onChange={(e) => setFormUser({ ...formUser, password: e.target.value })}
            />
            <div className={styles.modalActions}>
              <button onClick={handleSave}>{isEditing ? "Cập nhật" : "Lưu"}</button>
              <button onClick={() => setShowForm(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
