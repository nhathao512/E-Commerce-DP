import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    username: "",
    phone: "",
    address: "",
    fullName: "",
    avatar: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({});
  const [message, setMessage] = useState(null);

  const defaultImage =
    "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png";

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      setUserProfile({
        username: user.username || "",
        fullName: user.fullName || "",
        avatar: user.avatar || "",
        phone: user.phone || "",
        address: user.address || "",
      });
      setPreviewImage(user.avatar || defaultImage);
    }

    const fetchUserProfile = async () => {
      try {
        const response = await API.get("/auth/me"); // Đổi thành /api/auth/me
        setUserProfile(response.data);
        setPreviewImage(response.data.avatar || defaultImage);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setPreviewImage(defaultImage);
      }
    };
    fetchUserProfile();
  }, [isAuthenticated, navigate, user]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadResponse = await API.post("/upload/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const avatarUrl = uploadResponse.data;

        const updateResponse = await API.put("/auth/me", {
          // Đổi thành /api/auth/me
          phone: userProfile.phone,
          address: userProfile.address,
          fullName: userProfile.fullName,
          avatar: avatarUrl,
        });

        setUserProfile(updateResponse.data);
        setPreviewImage(updateResponse.data.avatar || defaultImage);
        setMessage({ text: "Avatar updated successfully!", type: "success" });
      } catch (error) {
        console.error("Failed to upload avatar:", error);
        setMessage({ text: "Failed to update avatar.", type: "error" });
      } finally {
        setIsLoading(false);
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
      const response = await API.put("/auth/me", {
        // Đổi thành /api/auth/me
        phone: editProfile.phone,
        address: editProfile.address,
        fullName: editProfile.fullName,
        avatar: userProfile.avatar,
      });
      setUserProfile(response.data);
      setIsModalOpen(false);
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage({ text: "Failed to update profile.", type: "error" });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>User Profile</h2>
      {message && (
        <div
          className={message.type === "success" ? styles.success : styles.error}
        >
          {message.text}
        </div>
      )}
      <div className={styles.profileCard}>
        <div className={styles.formSection}>
          <div className={styles.profileField}>
            <label className={styles.label}>Full Name</label>
            <div className={styles.value}>{userProfile.fullName}</div>
          </div>
          <div className={styles.profileField}>
            <label className={styles.label}>Username</label>
            <div className={styles.value}>{userProfile.username}</div>
          </div>
          <div className={styles.profileField}>
            <label className={styles.label}>Phone</label>
            <div className={styles.value}>{userProfile.phone}</div>
          </div>
          <div className={styles.profileField}>
            <label className={styles.label}>Address</label>
            <div className={styles.value}>{userProfile.address}</div>
          </div>
          <button className={styles.editButton} onClick={openModal}>
            Edit Profile
          </button>
        </div>
        <div className={styles.imageSection}>
          <div className={styles.avatarWrapper}>
            {isLoading ? (
              <div className={styles.loader}>Uploading...</div>
            ) : (
              <img
                src={previewImage || defaultImage}
                alt="Profile"
                className={styles.avatar}
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
            )}
          </div>
          <label htmlFor="imageUpload" className={styles.uploadButton}>
            Upload New Image
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

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Edit Profile</h3>
            <div className={styles.modalContent}>
              <div className={styles.modalField}>
                <label className={styles.label}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={editProfile.fullName}
                  onChange={handleEditChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.modalField}>
                <label className={styles.label}>Username</label>
                <input
                  type="text"
                  name="username"
                  value={editProfile.username}
                  disabled
                  className={styles.inputDisabled}
                />
              </div>
              <div className={styles.modalField}>
                <label className={styles.label}>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editProfile.phone}
                  onChange={handleEditChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.modalField}>
                <label className={styles.label}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={editProfile.address}
                  onChange={handleEditChange}
                  className={styles.input}
                />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.updateButton} onClick={handleUpdate}>
                Update
              </button>
              <button className={styles.cancelButton} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
