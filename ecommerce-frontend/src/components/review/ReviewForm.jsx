import React, { useState, useEffect } from "react";
import { addReview, getReviews } from "../../services/api";
import styles from "./ReviewForm.module.css";

function ReviewForm({ productCode }) {
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const shortUserId = localStorage.getItem("shortUserId") || "anonymous"; // Lấy shortUserId từ localStorage

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

  const handleRating = (star) => {
    setRating(star);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("Vui lòng nhập nội dung bình luận!");
      return;
    }
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá!");
      return;
    }

    try {
      const reviewData = {
        productCode,
        shortUserId, // Lấy từ localStorage
        rating,
        comment: newComment,
      };
      await addReview(reviewData);
      const response = await getReviews(productCode);
      setReviews(response.data);
      setNewComment("");
      setRating(0);
      alert("Đánh giá thành công!");
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      alert("Đánh giá thất bại!");
    }
  };

  return (
    <div className={styles.commentSection}>
      <h2 className={styles.commentTitle}>Bình luận & Đánh giá</h2>

      {/* Form đánh giá */}
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

      {/* Danh sách đánh giá */}
      <div className={styles.commentList}>
        {reviews.length === 0 ? (
          <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className={styles.commentItem}>
              <p className={styles.commentUser}>{review.shortUserId}</p>
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
    </div>
  );
}

export default ReviewForm;
