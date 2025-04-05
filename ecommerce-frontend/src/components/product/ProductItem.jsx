import React from "react";
import { addToCart } from "../../services/api";
import styles from "./ProductItem.module.css";
import { useNavigate } from "react-router-dom";

function ProductItem({ product }) {
  const navigate = useNavigate();
  const API_URL = "http://localhost:8080/api"; // URL backend

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Error adding to cart:", error.response || error);
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  const handleProductDetail = () => {
    navigate(`/product/${product.id}`);
  };

  // Log dữ liệu để kiểm tra
  console.log("ProductItem received product:", product);

  // Lấy ảnh đầu tiên từ danh sách images
  const imageUrl =
    product.images && product.images.length > 0
      ? `${API_URL}/images/${product.images[0]}`
      : "https://placehold.co/600x400";

  // Log URL ảnh để debug
  console.log("Image URL:", imageUrl);

  return (
    <div className={styles.card} onClick={handleProductDetail}>
      <div className={styles.imageWrapper}>
        <img
          src={imageUrl}
          alt={product.name || "Product Image"}
          className={styles.image}
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400"; // Fallback nếu ảnh không load
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
            ${product.price ? (product.price / 1000).toFixed(2) : "0.00"}{" "}
            {/* Chia 1000 nếu giá là VND */}
          </span>
        </div>
        <button
          className={styles.addButton}
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

export default ProductItem;
