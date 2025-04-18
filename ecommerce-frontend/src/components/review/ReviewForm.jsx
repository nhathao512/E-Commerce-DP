import React, { useState, useEffect, useContext } from "react";
import { addReview } from "../../services/api";
import styles from "./ReviewForm.module.css";
import { FaExclamationTriangle } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

function ReviewForm({ productCode, onClose }) {
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const { isAuthenticated, user } = useContext(AuthContext);
  const shortUserId = user?.shortUserId || "anonymous";

  useEffect(() => {
    if (showLoginPopup) {
      const timer = setTimeout(() => {
        setShowLoginPopup(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showLoginPopup]);

  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  const handleRating = (star) => {
    setRating(star);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }

    if (!newComment.trim()) {
      setAlertMessage({
        text: "Vui lòng nhập nội dung bình luận!",
        type: "error",
      });
      return;
    }
    if (rating < 1 || rating > 5) {
      setAlertMessage({
        text: "Vui lòng chọn số sao đánh giá từ 1 đến 5!",
        type: "error",
      });
      return;
    }
    if (!productCode || productCode === "UNKNOWN") {
      setAlertMessage({
        text: "Mã sản phẩm không hợp lệ!",
        type: "error",
      });
      return;
    }
    if (shortUserId === "anonymous") {
      setAlertMessage({
        text: "Không thể gửi đánh giá với người dùng ẩn danh!",
        type: "error",
      });
      return;
    }

    try {
      const reviewData = {
        productCode,
        shortUserId,
        rating,
        comment: newComment.trim(),
      };
      console.log("Dữ liệu đánh giá gửi đi:", reviewData); // Ghi log để kiểm tra
      const response = await addReview(reviewData);
      console.log("Phản hồi đánh giá:", response.data); // Ghi log để kiểm tra
      setNewComment("");
      setRating(0);
      setAlertMessage({ text: "Đánh giá thành công!", type: "success" });
      if (onClose) {
        setTimeout(onClose, 1000);
      }
    } catch (error) {
      console.error(
        "Lỗi khi gửi đánh giá:",
        error.response?.data || error.message
      );
      setAlertMessage({
        text: error.response?.data || "Đánh giá thất bại! Vui lòng thử lại.",
        type: "error",
      });
    }
  };

  return (
    <div className={styles.commentSection}>
      <h2 className={styles.commentTitle}>Bình luận & Đánh giá</h2>

      <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
        <div className={styles.ratingSection}>
          <p>Đánh giá:</p>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`${styles.star} ${
                  star <= rating ? styles.starFilled : ""
                }`}
                onClick={() => handleRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <textarea
          className={styles.commentInput}
          placeholder="Viết bình luận của bạn..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" className={styles.submitButton}>
          Gửi bình luận
        </button>
      </form>

      {showLoginPopup && (
        <div className={styles.loginPopup}>
          <FaExclamationTriangle className={styles.alertIcon} />
          <p>Vui lòng đăng nhập để gửi đánh giá!</p>
          <button
            className={styles.closeButton}
            onClick={() => setShowLoginPopup(false)}
          >
            Đóng
          </button>
        </div>
      )}

      {alertMessage && (
        <div
          className={`${styles.alertPopup} ${
            alertMessage.type === "success" ? styles.success : styles.error
          }`}
        >
          <p>{alertMessage.text}</p>
          <button
            className={styles.closeButton}
            onClick={() => setAlertMessage(null)}
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewForm;
