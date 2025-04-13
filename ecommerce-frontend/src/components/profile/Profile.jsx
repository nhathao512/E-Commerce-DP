import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

// Ảnh mặc định khi không có ảnh đại diện
const DEFAULT_AVATAR =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiBmaWxsPSJub25lIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iI0UyRThGMCIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjgwIiByPSI0MCIgZmlsbD0iIzAyODhEMSIvPjxwYXRoIGQ9Ik0xNjAgMTkwQzE2MCAxNTYuODYzIDEzMy4xMzcgMTMwIDEwMCAxMzBDNjYuODYzIDEzMCA0MCAxNTYuODYzIDQwIDE5MEg2MEg4MEgxMjBIMTQwSDE2MFoiIGZpbGw9IiMwMjg4RDEiLz48L3N2Zz4=";

const Profile = () => {
  const { user, setUser, isAuthenticated, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    username: "",
    phone: "",
    address: "",
    fullName: "",
    avatar: "",
  });
  const [previewImage, setPreviewImage] = useState(DEFAULT_AVATAR);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await API.get(`/auth/me?username=${user.username}`);
        const fetchedUser = response.data;

        if (fetchedUser.error) {
          throw new Error(fetchedUser.error);
        }

        setUserProfile({
          username: fetchedUser.username || "",
          fullName: fetchedUser.fullName || "",
          avatar: fetchedUser.avatar || "",
          phone: fetchedUser.phone || "",
          address: fetchedUser.address || "",
        });

        const backendBaseUrl = "http://localhost:8080/api/images";
        const imageUrl = fetchedUser.avatar
          ? `${backendBaseUrl}/${fetchedUser.avatar}?t=${Date.now()}`
          : DEFAULT_AVATAR;

        setPreviewImage(imageUrl);
      } catch (error) {
        console.error("Không thể tải thông tin hồ sơ:", error);
        setMessage({
          text: error.message || "Không thể tải thông tin hồ sơ.",
          type: "error",
        });
        setPreviewImage(DEFAULT_AVATAR);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, navigate, user, isLoading]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoadingProfile(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("username", user.username);

      try {
        const uploadResponse = await API.post("/upload/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const updatedUser = uploadResponse.data;

        if (updatedUser.error) {
          throw new Error(updatedUser.error);
        }

        setUserProfile(updatedUser);
        const backendBaseUrl = "http://localhost:8080/api/images";
        const imageUrl = updatedUser.avatar
          ? `${backendBaseUrl}${updatedUser.avatar}?t=${Date.now()}`
          : DEFAULT_AVATAR;

        setPreviewImage(imageUrl);
        setMessage({
          text: "Cập nhật ảnh đại diện thành công!",
          type: "success",
        });

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Không thể tải ảnh đại diện:", error);
        setMessage({
          text: error.message || "Cập nhật ảnh đại diện thất bại.",
          type: "error",
        });
      } finally {
        setIsLoadingProfile(false);
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  const openModal = () => {
    setEditProfile({ ...userProfile });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProfile({ ...editProfile, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("phone", editProfile.phone || "");
      formData.append("address", editProfile.address || "");
      formData.append("fullName", editProfile.fullName || "");
      formData.append("avatar", userProfile.avatar || "");

      const response = await API.put("/auth/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedUser = response.data;

      if (updatedUser.error) {
        throw new Error(updatedUser.error);
      }

      setUserProfile(updatedUser);
      setIsModalOpen(false);
      setMessage({ text: "Cập nhật hồ sơ thành công!", type: "success" });

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Không thể cập nhật hồ sơ:", error);
      setMessage({
        text: error.message || "Cập nhật hồ sơ thất bại.",
        type: "error",
      });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <div className={styles.loaderText}>Đang tải hồ sơ...</div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>Hồ Sơ Người Dùng</h2>
      {message && (
        <div
          className={`${styles.message} ${
            message.type === "success" ? styles.success : styles.error
          }`}
        >
          <span>{message.text}</span>
        </div>
      )}
      <div className={styles.profileCard}>
        {/* Thông tin và nút chỉnh sửa bên trái */}
        <div className={styles.infoSection}>
          <div className={styles.formSection}>
            <div className={styles.profileField}>
              <label className={styles.label}>Họ và Tên</label>
              <div className={styles.value}>
                {userProfile.fullName || "Chưa cập nhật"}
              </div>
            </div>
            <div className={styles.profileField}>
              <label className={styles.label}>Tên Đăng Nhập</label>
              <div className={styles.value}>{userProfile.username}</div>
            </div>
            <div className={styles.profileField}>
              <label className={styles.label}>Số Điện Thoại</label>
              <div className={styles.value}>
                {userProfile.phone || "Chưa cập nhật"}
              </div>
            </div>
            <div className={styles.profileField}>
              <label className={styles.label}>Địa Chỉ</label>
              <div className={styles.value}>
                {userProfile.address || "Chưa cập nhật"}
              </div>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.editButton} onClick={openModal}>
              Chỉnh Sửa Hồ Sơ
            </button>
          </div>
        </div>

        {/* Hình ảnh bên phải */}
        <div className={styles.imageSection}>
          <div className={styles.avatarWrapper}>
            {isLoadingProfile ? (
              <div className={styles.loader}>Đang tải ảnh...</div>
            ) : (
              <img
                src={previewImage}
                alt="Ảnh đại diện"
                className={styles.avatar}
                onError={(e) => {
                  console.log("Image load error:", e);
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
            )}
          </div>
          <div className={styles.uploadButtonContainer}>
            <label htmlFor="imageUpload" className={styles.uploadButton}>
              Tải Ảnh Lên
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Chỉnh Sửa Hồ Sơ</h3>
            <div className={styles.modalContent}>
              <div className={styles.modalField}>
                <label>Họ và Tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={editProfile.fullName || ""}
                  onChange={handleEditChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.modalField}>
                <label>Tên Đăng Nhập</label>
                <input
                  type="text"
                  name="username"
                  value={editProfile.username || ""}
                  disabled
                  className={styles.inputDisabled}
                />
              </div>
              <div className={styles.modalField}>
                <label>Số Điện Thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={editProfile.phone || ""}
                  onChange={handleEditChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.modalField}>
                <label>Địa Chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={editProfile.address || ""}
                  onChange={handleEditChange}
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.updateButton} onClick={handleUpdate}>
                Cập Nhật
              </button>
              <button className={styles.cancelButton} onClick={closeModal}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
