import React, { useState, useEffect } from "react";
import { getReviews } from "../../services/api";
import { useSearchParams } from "react-router-dom"; // Thay useLocation bằng useSearchParams

function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [searchParams] = useSearchParams(); // Thay useLocation bằng useSearchParams
  const productId = searchParams.get("productId") || "1"; // Lấy productId từ query params

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
              {review.content} - {review.rating} sao
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReviewList;
