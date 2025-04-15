import React, { useState } from "react";
import {
  removeFromCart,
  updateCartItemQuantity,
  getProductById,
} from "../../services/api";
import Popup from "../common/Popup";
import styles from "./CartItem.module.css";
import cartStyles from "./Cart.module.css"; // Import Cart.module.css to reuse popupOverlay

function CartItem({ item, setCartItems, isSelected, onCheckboxChange }) {
  const [popup, setPopup] = useState(null);

  const checkStockAvailability = async (productId, size, desiredQuantity) => {
    try {
      const response = await getProductById(productId);
      const product = response.data;
      const stockForSize = product.quantity[size] || 0;
      return desiredQuantity <= stockForSize;
    } catch (err) {
      console.error("Error checking stock:", err);
      return false;
    }
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem("userID");
    if (!userId) {
      setPopup({
        message: "Vui lòng đăng nhập để cập nhật giỏ hàng!",
        type: "warning",
        onClose: () => setPopup(null),
        showCloseButton: false,
        confirmButton: {
          text: "Đăng nhập",
          onClick: () => (window.location.href = "/login"),
        },
        cancelButton: {
          text: "Đóng",
          onClick: () => setPopup(null),
        },
        className: cartStyles.popupOverlay, // Use the popupOverlay class
      });
      return;
    }

    const newQuantity = item.quantity + 1;

    const canAddMore = await checkStockAvailability(
      item.id,
      item.size,
      newQuantity
    );
    if (!canAddMore) {
      setPopup({
        message: `Số lượng tồn kho không đủ! Chỉ còn ${item.quantity} sản phẩm cho kích thước ${item.size}.`,
        type: "error",
        onClose: () => setPopup(null),
        className: cartStyles.popupOverlay, // Use the popupOverlay class
      });
      return;
    }

    try {
      await updateCartItemQuantity(userId, item.id, item.size, newQuantity);
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: newQuantity }
            : i
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        window.dispatchEvent(new Event("cartUpdated"));
        return updatedItems;
      });
    } catch (err) {
      console.error("Error updating quantity:", err);
      setPopup({
        message: "Không thể tăng số lượng. Vui lòng thử lại!",
        type: "error",
        onClose: () => setPopup(null),
        className: cartStyles.popupOverlay, // Use the popupOverlay class
      });
    }
  };

  const handleRemove = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem("userID");
    if (!userId) {
      setPopup({
        message: "Vui lòng đăng nhập để cập nhật giỏ hàng!",
        type: "warning",
        onClose: () => setPopup(null),
        showCloseButton: false,
        confirmButton: {
          text: "Đăng nhập",
          onClick: () => (window.location.href = "/login"),
        },
        cancelButton: {
          text: "Đóng",
          onClick: () => setPopup(null),
        },
        className: cartStyles.popupOverlay, // Use the popupOverlay class
      });
      return;
    }

    const newQuantity = item.quantity - 1;
    if (newQuantity < 1) {
      setPopup({
        message: "Số lượng tối thiểu là 1. Nếu muốn xóa, hãy nhấn nút Xóa!",
        type: "info",
        onClose: () => setPopup(null),
        className: cartStyles.popupOverlay, // Use the popupOverlay class
      });
      return;
    }

    try {
      await updateCartItemQuantity(userId, item.id, item.size, newQuantity);
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: newQuantity }
            : i
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        window.dispatchEvent(new Event("cartUpdated"));
        return updatedItems;
      });
    } catch (err) {
      console.error("Error updating quantity:", err);
      setPopup({
        message: "Không thể giảm số lượng. Vui lòng thử lại!",
        type: "error",
        onClose: () => setPopup(null),
        className: cartStyles.popupOverlay, // Use the popupOverlay class
      });
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    try {
      const userId = localStorage.getItem("userID");
      if (!userId) {
        setPopup({
          message: "Vui lòng đăng nhập để xóa sản phẩm!",
          type: "warning",
          onClose: () => setPopup(null),
          showCloseButton: false,
          confirmButton: {
            text: "Đăng nhập",
            onClick: () => (window.location.href = "/login"),
          },
          cancelButton: {
            text: "Đóng",
            onClick: () => setPopup(null),
          },
          className: cartStyles.popupOverlay, // Use the popupOverlay class
        });
        return;
      }
      await removeFromCart(userId, item.id, item.size);
      setCartItems((prevItems) => {
        const updatedItems = prevItems.filter(
          (i) => !(i.id === item.id && i.size === item.size)
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
        window.dispatchEvent(new Event("cartUpdated"));
        return updatedItems;
      });
      setPopup({
        message: `Đã xóa ${item.productName} (${item.size}) khỏi giỏ hàng!`,
        type: "success",
        onClose: () => setPopup(null),
        className: cartStyles.popupOverlay, // Use the popupOverlay class
      });
    } catch (err) {
      console.error("Error removing item from cart:", err);
      setPopup({
        message: "Không thể xóa sản phẩm. Vui lòng thử lại!",
        type: "error",
        onClose: () => setPopup(null),
        className: cartStyles.popupOverlay, // Use the popupOverlay class
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
          type="button"
          className={`${styles.button} ${styles.buttonAdjust}`}
          onClick={handleRemove}
        >
          -
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.buttonAdjust}`}
          onClick={handleAdd}
        >
          +
        </button>
        <button
          type="button"
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
