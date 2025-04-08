// Profile.jsx
import React, { useState, useEffect } from "react";
import styles from "./Profile.module.css";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({
    username: "",
    phone: "",
    address: "",
    fullname: "",
    image: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({});

  const defaultImage =
    "https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png";

  useEffect(() => {
    const mockData = {
      username: "john_doe",
      phone: "0123-456-789",
      address: "123 Main Street, City",
      fullname: "John Doe",
      image: null,
    };
    setUserProfile(mockData);
    setPreviewImage(mockData.image);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setTimeout(() => {
          setUserProfile({ ...userProfile, image: reader.result });
          setIsLoading(false);
        }, 1000);
      };
      reader.readAsDataURL(file);
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

  const handleUpdate = () => {
    setUserProfile({
      ...userProfile,
      phone: editProfile.phone,
      address: editProfile.address,
      fullname: editProfile.fullname,
    });
    setIsModalOpen(false);
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>User Profile</h2>
      <div className={styles.profileCard}>
        <div className={styles.formSection}>
          <div className={styles.profileField}>
            <label className={styles.label}>Full Name</label>
            <div className={styles.value}>{userProfile.fullname}</div>
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
                  name="fullname"
                  value={editProfile.fullname}
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
