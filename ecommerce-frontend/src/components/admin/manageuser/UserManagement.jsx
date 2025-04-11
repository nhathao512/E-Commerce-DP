import React, { useState, useEffect } from "react";
import Dashboard from "../dashboard/Dashboard";
import styles from "./UserManagement.module.css";
import { FaUsersCog } from "react-icons/fa";
import axios from "axios";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAsc, setIsAsc] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/auth/users"
        );
        setUsers(response.data || []); // Đảm bảo users là mảng rỗng nếu không có dữ liệu
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((user) => {
      const username = user.username || ""; // Gán giá trị mặc định nếu undefined
      const fullName = user.fullName || "";
      return (
        username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) =>
      isAsc
        ? (a.username || "").localeCompare(b.username || "")
        : (b.username || "").localeCompare(a.username || "")
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
    const user = users.find((u) => u.id === id);
    setUserToDelete(user);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/auth/users/${userToDelete.id}`
      );
      setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
      setIsDeletePopupOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newUser = {
      username: form.username.value,
      phone: form.phone.value || "",
      address: form.address.value || "",
      fullName: form.fullName.value || "",
      avatar: form.avatar?.value || "",
    };

    try {
      if (editingUser) {
        const response = await axios.put(
          `http://localhost:8080/api/auth/me?username=${newUser.username}`,
          null,
          { params: newUser }
        );
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? response.data : u))
        );
      } else {
        const password = prompt("Vui lòng nhập mật khẩu cho người dùng mới:");
        if (!password) {
          alert("Mật khẩu là bắt buộc khi tạo người dùng mới!");
          return;
        }
        newUser.password = password;
        const response = await axios.post(
          "http://localhost:8080/api/auth/register",
          newUser
        );
        setUsers((prev) => [...prev, response.data]);
      }
      setIsPopupOpen(false);
    } catch (error) {
      console.error("Error submitting user:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <FaUsersCog /> Quản lý người dùng
        </h1>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleCreate}>➕ Tạo</button>
          <button onClick={() => setIsAsc(!isAsc)}>
            {isAsc ? "⬇ DESC" : "⬆ ASC"}
          </button>
        </div>
      </div>

      <Dashboard
        columns={[
          { key: "id", label: "ID" },
          { key: "username", label: "Tên đăng nhập" },
          { key: "fullName", label: "Họ và Tên" },
          { key: "phone", label: "Số điện thoại" },
          { key: "address", label: "Địa chỉ" },
        ]}
        data={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isPopupOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>{editingUser ? "Chỉnh sửa thông tin" : "Tạo tài khoản"}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Tên đăng nhập:</label>
                <input
                  type="text"
                  name="username"
                  defaultValue={editingUser?.username || ""}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Họ và Tên:</label>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={editingUser?.fullName || ""}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={editingUser?.phone || ""}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Địa chỉ:</label>
                <input
                  type="text"
                  name="address"
                  defaultValue={editingUser?.address || ""}
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

      {isDeletePopupOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>Xác nhận xóa</h2>
            <p>
              Bạn có chắc chắn muốn xóa người dùng{" "}
              <strong>{userToDelete?.username}</strong> không?
            </p>
            <div className={styles.buttonGroup}>
              <button onClick={confirmDelete}>Xóa</button>
              <button
                onClick={() => {
                  setIsDeletePopupOpen(false);
                  setUserToDelete(null);
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
