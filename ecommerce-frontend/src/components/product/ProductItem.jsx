import React from "react";
import { addToCart } from "../../services/api";
import styles from "./ProductItem.module.css";

function ProductItem({ product }) {
  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      alert("Đã thêm vào giỏ hàng!");
    } catch {
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={product.image} alt={product.name} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.priceWrapper}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
        </div>
        <button className={styles.addButton} onClick={handleAddToCart}>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

export default ProductItem;