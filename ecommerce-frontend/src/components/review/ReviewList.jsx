import React, { useState, useEffect } from "react";
import { getReviews } from "../../services/api";
import styles from "./ReviewList.module.css";

function ReviewList({ productCode }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState({
    value: 0,
    fullStars: 0,
    hasHalfStar: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviews(productCode);
        const fetchedReviews = response.data;
        setReviews(fetchedReviews);

        if (fetchedReviews.length > 0) {
          const totalRating = fetchedReviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const avg = totalRating / fetchedReviews.length;
          const roundedAvg = Number(avg.toFixed(1));
          const fullStars = Math.floor(roundedAvg);
          const hasHalfStar = roundedAvg % 1 >= 0.3 && roundedAvg % 1 <= 0.7;
          setAverageRating({ value: roundedAvg, fullStars, hasHalfStar });
        } else {
          setAverageRating({ value: 0, fullStars: 0, hasHalfStar: false });
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);
      }
    };
    fetchReviews();
  }, [productCode]);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.reviewList}>
      <h2 className={styles.reviewTitle}>Danh sách đánh giá</h2>
      {reviews.length > 0 && (
        <div className={styles.averageRating}>
          <span className={styles.averageRatingText}>
            {averageRating.value} / 5 ({reviews.length} đánh giá)
          </span>
          <div className={styles.averageStars}>
            {[...Array(5)].map((_, index) => {
              if (index < averageRating.fullStars) {
                return (
                  <span
                    key={index}
                    className={`${styles.averageStar} ${styles.averageStarFilled}`}
                  >
                    ★
                  </span>
                );
              }
              if (
                index === averageRating.fullStars &&
                averageRating.hasHalfStar
              ) {
                return (
                  <span
                    key={index}
                    className={`${styles.averageStar} ${styles.averageStarHalf}`}
                  >
                    ★
                  </span>
                );
              }
              return (
                <span key={index} className={styles.averageStar}>
                  ★
                </span>
              );
            })}
          </div>
        </div>
      )}
      {reviews.length === 0 ? (
        <p className={styles.noReviews}>Chưa có đánh giá nào</p>
      ) : (
        <>
          <ul className={styles.reviewItems}>
            {currentReviews.map((review, index) => (
              <li
                key={review.id}
                className={styles.reviewItem}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
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
                <p className={styles.reviewComment}>
                  {review.comment || "Không có bình luận"}
                </p>
                <span className={styles.reviewDate}>
                  {new Date(review.date).toLocaleDateString("vi-VN")}
                </span>
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={`${styles.paginationButton} ${
                  currentPage === 1 ? styles.disabled : ""
                }`}
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`${styles.pageNumber} ${
                    currentPage === index + 1 ? styles.activePage : ""
                  }`}
                  onClick={() => goToPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className={`${styles.paginationButton} ${
                  currentPage === totalPages ? styles.disabled : ""
                }`}
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ReviewList;
