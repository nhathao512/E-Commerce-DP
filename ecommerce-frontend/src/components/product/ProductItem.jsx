import React, { useState, useEffect } from "react";
import styles from "./ProductItem.module.css";
import { useNavigate } from "react-router-dom";
import { getReviews } from "../../services/api";

function ProductItem({ product }) {
  const navigate = useNavigate();
  const API_URL = "http://localhost:8080/api";
  const [averageRating, setAverageRating] = useState({
    value: 0,
    fullStars: 0,
    hasHalfStar: false,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviews(product.productCode);
        const fetchedReviews = response.data;

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
        }
      } catch (error) {
        console.error(
          "Error fetching reviews for product:",
          product.productCode,
          error
        );
      }
    };
    fetchReviews();
  }, [product.productCode]);

  const handleProductDetail = () => {
    navigate(`/product/${product.id}`);
  };

  console.log("ProductItem received product:", product);

  const imageUrl =
    product.images && product.images.length > 0
      ? `${API_URL}/images/${product.images[0]}`
      : "https://placehold.co/600x400";

  return (
    <div className={styles.card} onClick={handleProductDetail}>
      <div className={styles.imageWrapper}>
        <img
          src={imageUrl}
          alt={product.name || "Product Image"}
          className={styles.image}
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400";
            console.error("Image failed to load:", imageUrl);
          }}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{product.name || "Unnamed Product"}</h3>
        <p className={styles.description}>
          {product.description || "No description available"}
        </p>
        <div className={styles.rating}>
          {[...Array(5)].map((_, index) => {
            if (index < averageRating.fullStars) {
              return (
                <span
                  key={index}
                  className={`${styles.star} ${styles.starFilled}`}
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
                  className={`${styles.star} ${styles.starHalf}`}
                >
                  ★
                </span>
              );
            }
            return (
              <span key={index} className={styles.star}>
                ★
              </span>
            );
          })}
          <span className={styles.ratingValue}>({averageRating.value})</span>
        </div>
        <div className={styles.priceWrapper}>
          <span className={styles.price}>
            {product.price
              ? product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
                " VNĐ"
              : "0.00 VNĐ"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ProductItem;
