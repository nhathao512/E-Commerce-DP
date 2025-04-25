import React, { useState, useEffect, useMemo } from "react";
import Dashboard from "../dashboard/Dashboard";
import styles from "./UserManagement.module.css";
import { FaUsersCog, FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAsc, setIsAsc] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/auth/users");
      console.log("Fetched users:", response.data);
      setUsers(response.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải danh sách người dùng!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const username = user.username?.toLowerCase() || "";
        const fullName = user.fullName?.toLowerCase() || "";
        return (
          username.includes(searchTerm.toLowerCase()) ||
          fullName.includes(searchTerm.toLowerCase())
        );
      })
      .sort((a, b) => {
        const usernameA = a.username || "";
        const usernameB = b.username || "";
        return isAsc
          ? usernameA.localeCompare(usernameB)
          : usernameB.localeCompare(usernameA);
      });
  }, [users, searchTerm, isAsc]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setIsPopupOpen(true);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsPopupOpen(true);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleDelete = (id) => {
    const user = users.find((u) => u.id === id);
    setUserToDelete(user);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(
        `http://localhost:8080/api/auth/users/${userToDelete.id}`
      );
      await fetchUsers();
      toast.success(`Đã xóa người dùng ${userToDelete.username}`);
      setIsDeletePopupOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Không thể xóa người dùng!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newUser = {
      username: form.username.value,
      password: form.password?.value || undefined,
      confirmPassword: form.confirmPassword?.value || undefined,
      phone: form.phone.value || "",
      address: form.address.value || "",
      fullName: form.fullName.value || "",
      avatar: form.avatar?.value || "",
    };

    if (!editingUser && newUser.password !== newUser.confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    setIsLoading(true);
    try {
      if (editingUser) {
        console.log("Current users:", users);
        const userExists = users.some((u) => u.username === newUser.username);
        if (!userExists) {
          console.error(`User ${newUser.username} does not exist`);
          toast.error(`Người dùng ${newUser.username} không tồn tại!`);
          setIsLoading(false);
          return;
        }
        console.log("Sending update for user:", newUser);
        const response = await axios.put(
          "http://localhost:8080/api/auth/me",
          null,
          {
            params: {
              username: newUser.username,
              phone: newUser.phone,
              address: form.address.value || "",
              fullName: newUser.fullName,
              avatar: newUser.avatar,
            },
          }
        );
        console.log("Update response:", response.data);
        toast.success(`Đã cập nhật thông tin cho ${newUser.username}`);
      } else {
        if (!newUser.password) {
          toast.error("Mật khẩu là bắt buộc khi tạo người dùng mới!");
          setIsLoading(false);
          return;
        }
        console.log("Creating user:", newUser);
        const response = await axios.post(
          "http://localhost:8080/api/auth/register",
          {
            ...newUser,
            confirmPassword: undefined,
          }
        );
        console.log("Create response:", response.data);
        toast.success(`Đã tạo người dùng ${newUser.username}`);
      }
      await fetchUsers();
      setIsPopupOpen(false);
      setEditingUser(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      console.error("Error submitting user:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      toast.error(
        `Lỗi: ${error.response?.data?.message || "Không thể lưu người dùng!"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <FaUsersCog style={{ marginRight: "0.5rem" }} /> QUẢN LÝ NGƯỜI DÙNG
        </h1>
      </div>

      <div className={styles.searchBar}>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
          <button onClick={handleCreate} disabled={isLoading}>
            Tạo mới
          </button>
          <button onClick={() => setIsAsc(!isAsc)} disabled={isLoading}>
            {isAsc ? "⬇ DESC" : "⬆ ASC"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Đang tải...</div>
      ) : (
        <>
          <Dashboard
            columns={[
              { key: "id", label: "ID" },
              { key: "username", label: "Tên đăng nhập" },
              { key: "fullName", label: "Họ và Tên" },
              { key: "phone", label: "Số điện thoại" },
              { key: "address", label: "Địa chỉ" },
            ]}
            data={paginatedUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={page === currentPage ? styles.activePage : ""}
                    disabled={isLoading}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}

      {isPopupOpen && (
        <div className={styles.overlay} onClick={() => setIsPopupOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editingUser ? "Chỉnh sửa thông tin" : "Tạo tài khoản"}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Tên đăng nhập:</label>
                <input
                  type="text"
                  name="username"
                  defaultValue={editingUser?.username || ""}
                  required
                  disabled={isLoading || editingUser}
                />
              </div>
              {!editingUser && (
                <>
                  <div className={styles.formGroup}>
                    <label>Mật khẩu:</label>
                    <div className={styles.passwordContainer}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        disabled={isLoading}
                      />
                      <span
                        className={styles.eyeIcon}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Xác nhận mật khẩu:</label>
                    <div className={styles.passwordContainer}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
                        disabled={isLoading}
                      />
                      <span
                        className={styles.eyeIcon}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    </div>
                  </div>
                </>
              )}
              <div className={styles.formGroup}>
                <label>Họ và Tên:</label>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={editingUser?.fullName || ""}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Số điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={editingUser?.phone || ""}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Địa chỉ:</label>
                <input
                  type="text"
                  name="address"
                  defaultValue={editingUser?.address || ""}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Avatar URL:</label>
                <input
                  type="text"
                  name="avatar"
                  defaultValue={editingUser?.avatar || ""}
                  disabled={isLoading}
                />
              </div>
              <div className={styles.buttonGroup}>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Đang lưu..." : "Lưu"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPopupOpen(false);
                    setShowPassword(false);
                    setShowConfirmPassword(false);
                  }}
                  disabled={isLoading}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeletePopupOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsDeletePopupOpen(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Xác nhận xóa</h2>
            <p>
              Bạn có chắc chắn muốn xóa người dùng{" "}
              <strong>{userToDelete?.username}</strong> không?
            </p>
            <div className={styles.buttonGroup}>
              <button
                onClick={confirmDelete}
                className={styles.deleteButton}
                disabled={isLoading}
              >
                {isLoading ? "Đang xóa..." : "Xóa"}
              </button>
              <button
                onClick={() => {
                  setIsDeletePopupOpen(false);
                  setUserToDelete(null);
                }}
                disabled={isLoading}
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
