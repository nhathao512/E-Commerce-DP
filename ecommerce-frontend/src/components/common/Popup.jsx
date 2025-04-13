import React, { useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSpinner,
} from "react-icons/fa";
import styles from "./Popup.module.css";

function Popup({
  message,
  type = "info",
  onClose,
  duration = 2000,
  showCloseButton = true,
  confirmButton,
  cancelButton,
}) {
  const progressDuration = duration;

  useEffect(() => {
    if (!confirmButton && !cancelButton) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration, confirmButton, cancelButton]);

  const renderIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle size={44} />;
      case "error":
        return <FaTimesCircle size={44} />;
      case "warning":
        return <FaExclamationTriangle size={44} />;
      case "info":
        return <FaInfoCircle size={44} />;
      case "loading":
        return <FaSpinner size={44} />;
      default:
        return <FaInfoCircle size={44} />;
    }
  };

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div
        className={`${styles.popup} ${styles[type]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.icon}>{renderIcon()}</div>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonContainer}>
          {confirmButton && (
            <button
              className={styles.confirmButton}
              onClick={confirmButton.onClick}
            >
              {confirmButton.text}
            </button>
          )}
          {cancelButton && (
            <button
              className={styles.cancelButton}
              onClick={cancelButton.onClick}
            >
              {cancelButton.text}
            </button>
          )}
          {showCloseButton && !confirmButton && !cancelButton && (
            <button className={styles.closeButton} onClick={onClose}>
              Đóng
            </button>
          )}
        </div>
        {!confirmButton && !cancelButton && (
          <div
            className={styles.progressBar}
            style={{ animationDuration: `${progressDuration}ms` }}
          />
        )}
      </div>
    </div>
  );
}

export default Popup;
