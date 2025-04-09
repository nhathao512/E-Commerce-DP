import React, { useState, useEffect, useContext } from "react";
import { addReview, getReviews } from "../../services/api";
import styles from "./ReviewForm.module.css";
import { FaExclamationTriangle } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

function ReviewForm({ productCode }) {
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const { isAuthenticated, user } = useContext(AuthContext);
  const shortUserId = user?.shortUserId || "anonymous";

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviews(productCode);
        setReviews(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
      }
    };
    fetchReviews();
  }, [productCode]);

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
    if (rating === 0) {
      setAlertMessage({
        text: "Vui lòng chọn số sao đánh giá!",
        type: "error",
      });
      return;
    }

    try {
      const reviewData = {
        productCode,
        shortUserId,
        rating,
        comment: newComment,
      };
      await addReview(reviewData);
      const response = await getReviews(productCode);
      setReviews(response.data);
      setNewComment("");
      setRating(0);
      setAlertMessage({ text: "Đánh giá thành công!", type: "success" });
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      setAlertMessage({ text: "Đánh giá thất bại!", type: "error" });
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

      <div className={styles.commentList}>
        {reviews.length === 0 ? (
          <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className={styles.commentItem}>
              <p className={styles.commentUser}>
                {review.fullName || "Anonymous"}
              </p>
              <div className={styles.commentRating}>
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`${styles.star} ${
                      index < review.rating ? styles.starFilled : ""
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className={styles.commentContent}>{review.comment}</p>
              <p className={styles.commentDate}>
                {new Date(review.date).toLocaleDateString("vi-VN")}
              </p>
            </div>
          ))
        )}
      </div>

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
