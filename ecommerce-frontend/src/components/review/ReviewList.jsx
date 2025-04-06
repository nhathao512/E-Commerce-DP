import React, { useState, useEffect } from "react";
import { getReviews } from "../../services/api";

function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviews(productId);
        setReviews(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
      }
    };
    fetchReviews();
  }, [productId]);

  return (
    <div>
      <h2>Danh sách đánh giá</h2>
      {reviews.length === 0 ? (
        <p>Chưa có đánh giá nào</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              {review.comment} - {review.rating} sao - {new Date(review.date).toLocaleDateString('vi-VN')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReviewList;