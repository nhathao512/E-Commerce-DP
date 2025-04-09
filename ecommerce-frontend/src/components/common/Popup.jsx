import React, { useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Import icons từ react-icons
import styles from "./Popup.module.css";

function Popup({ message, type, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Tự động đóng sau duration (mặc định 3 giây)
    }, duration);
    return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
  }, [onClose, duration]);

  return (
    <div className={styles.popupOverlay}>
      <div
        className={`${styles.popup} ${
          type === "success" ? styles.success : styles.error
        }`}
      >
        <div className={styles.icon}>
          {type === "success" ? (
            <FaCheckCircle size={40} />
          ) : (
            <FaTimesCircle size={40} />
          )}
        </div>
        <p className={styles.message}>{message}</p>
        <button className={styles.closeButton} onClick={onClose}>
          Đóng
        </button>
        <div
          className={styles.progressBar}
          style={{ animationDuration: `${duration}ms` }}
        ></div>
      </div>
    </div>
  );
}

export default Popup;
