import React, { useState, useEffect } from "react";
import { getReviews } from "../../services/api";
import styles from "./ReviewList.module.css";

function ReviewList({ productCode }) {
  const [reviews, setReviews] = useState([]);

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

  return (
    <div className={styles.reviewList}>
      <h2 className={styles.reviewTitle}>Danh sách đánh giá</h2>
      {reviews.length === 0 ? (
        <p className={styles.noReviews}>Chưa có đánh giá nào</p>
      ) : (
        <ul className={styles.reviewItems}>
          {reviews.map((review) => (
            <li key={review.id} className={styles.reviewItem}>
              <span className={styles.reviewUser}>
                {review.fullName || "Anonymous"}
              </span>
              <div className={styles.reviewRating}>
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
              <p className={styles.reviewComment}>{review.comment}</p>
              <span className={styles.reviewDate}>
                {new Date(review.date).toLocaleDateString("vi-VN")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReviewList;
