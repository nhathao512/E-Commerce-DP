import React from "react";
import styles from './Cart.module.css';

function CartItem({ item, setCartItems, isSelected, onCheckboxChange }) {
  const handleAdd = () => {
    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const handleRemove = () => {
    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i.id === item.id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
      )
    );
  };

  const handleDelete = () => {
    setCartItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
  };

  return (
    <li className={styles.cartItem}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={isSelected}
        onChange={onCheckboxChange}
      />
      <img
        src={item.imageUrl || "data:image/jpeg;base64,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"}
        alt={item.productName}
        className={styles.productImage}
      />
      <div className={styles.productInfo}>
        <p className={styles.productName}>{item.productName}</p>
        <p className={styles.quantity}>Số lượng: {item.quantity}</p>
        <p className={styles.price}>Giá: {(item.price * item.quantity).toLocaleString()} VNĐ</p>
      </div>
      <div className={styles.actions}>
        <button className={`${styles.button} ${styles.buttonAdjust}`} onClick={handleRemove}>
          -
        </button>
        <button className={`${styles.button} ${styles.buttonAdjust}`} onClick={handleAdd}>
          +
        </button>
        <button className={`${styles.button} ${styles.buttonRemove}`} onClick={handleDelete}>
          Xóa
        </button>
      </div>
    </li>
  );
}

export default CartItem;