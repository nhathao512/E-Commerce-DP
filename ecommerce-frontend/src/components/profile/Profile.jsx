import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    username: "",
    phone: "",
    address: "",
    fullName: "",
    avatar: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({});
  const [message, setMessage] = useState(null);

  const defaultImage =
    "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png";

  useEffect(() => {
    if (isLoading) return;

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
        setIsLoadingProfile(true);
        const response = await API.get(`/auth/me?username=${user.username}`);
        setUserProfile(response.data);
        setPreviewImage(response.data.avatar || defaultImage);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setPreviewImage(defaultImage);
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

        setUserProfile(updatedUser);
        setPreviewImage(updatedUser.avatar || defaultImage);
        setMessage({ text: "Avatar updated successfully!", type: "success" });

        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Failed to upload avatar:", error);
        setMessage({ text: "Failed to update avatar.", type: "error" });
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

      setUserProfile(response.data);
      setIsModalOpen(false);
      setMessage({ text: "Profile updated successfully!", type: "success" });

      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage({ text: "Failed to update profile.", type: "error" });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>User Profile</h2>
      {message && (
        <div
          className={`${styles.message} ${
            message.type === "success" ? styles.success : styles.error
          }`}
        >
          <span className={styles.messageText}>{message.text}</span>
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
            {isLoadingProfile ? (
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
