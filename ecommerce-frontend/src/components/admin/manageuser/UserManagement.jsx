import React, { useState } from "react";
import Dashboard from "../../common/Dashboard";
import styles from "./UserManagement.module.css";
import { FaUsersCog } from "react-icons/fa";

function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, username: "viet", password: "admin123" },
    { id: 2, username: "hao", password: "admin123" },
    { id: 3, username: "huy", password: "admin123" },
    { id: 4, username: "trung", password: "admin123" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAsc, setIsAsc] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = users
    .filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.password.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      isAsc
        ? a.username.localeCompare(b.username)
        : b.username.localeCompare(a.username)
    );

  const handleCreate = () => {
    setEditingUser(null);
    setIsPopupOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsPopupOpen(true);
  };

  const handleDelete = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const id = editingUser ? editingUser.id : Date.now();
    const newUser = {
      id,
      username: form.username.value,
      password: form.password.value,
    };

    setUsers((prev) => {
      if (editingUser) {
        return prev.map((u) => (u.id === id ? newUser : u));
      }
      return [...prev, newUser];
    });

    setIsPopupOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1><FaUsersCog /> Quản lý người dùng</h1>
    
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleCreate}>➕ Create</button>
          <button onClick={() => setIsAsc(!isAsc)}>
            {isAsc ? "⬇ DESC" : "⬆ ASC"}
          </button>
        </div>
      </div>

      <Dashboard
        columns={[
          { key: "id", label: "ID" },
          { key: "username", label: "Username" },
          { key: "password", label: "Password" },
        ]}
        data={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isPopupOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>{editingUser ? "Edit user" : "Add new user"}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  defaultValue={editingUser?.username || ""}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  defaultValue={editingUser?.password || ""}
                  required
                />
              </div>
              <div className={styles.buttonGroup}>
                <button type="submit">Lưu</button>
                <button type="button" onClick={() => setIsPopupOpen(false)}>
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

export default UserManagement;
