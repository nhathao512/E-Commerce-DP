import React, { useState } from "react";
import { removeFromCart } from "../../services/api";
import Popup from "../common/Popup";
import styles from "./CartItem.module.css";

function CartItem({ item, setCartItems, isSelected, onCheckboxChange }) {
  const [popup, setPopup] = useState(null);

  const handleAdd = () => {
    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i.id === item.id && i.size === item.size
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  };

  const handleRemove = () => {
    setCartItems((prevItems) =>
      prevItems.map((i) =>
        i.id === item.id && i.size === item.size && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    );
  };

  const handleDelete = async () => {
    try {
      const userId = localStorage.getItem("userID");
      if (!userId) {
        setPopup({
          message: "Vui lòng đăng nhập để xóa sản phẩm!",
          type: "warning",
          onClose: () => setPopup(null),
        });
        return;
      }
      await removeFromCart(userId, item.id, item.size);
      setCartItems((prevItems) =>
        prevItems.filter((i) => !(i.id === item.id && i.size === item.size))
      );
      window.dispatchEvent(new Event("cartUpdated"));
      setPopup({
        message: `Đã xóa ${item.productName} (${item.size}) khỏi giỏ hàng!`,
        type: "success",
        onClose: () => setPopup(null),
      });
    } catch (err) {
      console.error("Error removing item from cart:", err);
      setPopup({
        message: "Không thể xóa sản phẩm. Vui lòng thử lại!",
        type: "error",
        onClose: () => setPopup(null),
      });
    }
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
        src={
          item.imageUrl ||
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
        }
        alt={item.productName}
        className={styles.productImage}
      />
      <div className={styles.productInfo}>
        <p className={styles.productName}>
          {item.productName} ({item.size})
        </p>
        <p className={styles.quantity}>Số lượng: {item.quantity}</p>
        <p className={styles.price}>
          Giá: {(item.price * item.quantity).toLocaleString()} VNĐ
        </p>
      </div>
      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.buttonAdjust}`}
          onClick={handleRemove}
        >
          -
        </button>
        <button
          className={`${styles.button} ${styles.buttonAdjust}`}
          onClick={handleAdd}
        >
          +
        </button>
        <button
          className={`${styles.button} ${styles.buttonRemove}`}
          onClick={handleDelete}
        >
          Xóa
        </button>
      </div>
      {popup && <Popup {...popup} />}
    </li>
  );
}

export default CartItem;
