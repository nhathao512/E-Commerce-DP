import React from "react";
import styles from "./ProductItem.module.css";
import { useNavigate } from "react-router-dom";

function ProductItem({ product }) {
  const navigate = useNavigate();
  const API_URL = "http://localhost:8080/api";

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
