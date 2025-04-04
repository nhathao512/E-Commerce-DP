import React from "react";
import { addToCart } from "../../services/api";
import styles from "./ProductItem.module.css";
import { useNavigate } from "react-router-dom"; // Sửa từ Navigate thành useNavigate

function ProductItem({ product }) {
  const navigate = useNavigate(); // Khởi tạo hook useNavigate

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      alert("Đã thêm vào giỏ hàng!");
    } catch {
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  const handleProductDetail = () => {
    navigate(`/product/${product.id}`); // Chuyển hướng tới trang chi tiết với product id
  };

  return (
    <div className={styles.card} onClick={handleProductDetail}>
      <div className={styles.imageWrapper}>
        <img src={product.image} alt={product.name} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.priceWrapper}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
        </div>
        <button
          className={styles.addButton}
          onClick={(e) => {
            e.stopPropagation(); // Ngăn sự kiện click của card khi click button
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