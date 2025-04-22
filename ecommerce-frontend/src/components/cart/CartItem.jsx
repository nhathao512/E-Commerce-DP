import React, { useState } from "react";
import {
  removeFromCart,
  updateCartItemQuantity,
  getProductById,
} from "../../services/api";
import styles from "./CartItem.module.css";
import cartStyles from "./Cart.module.css";

function CartItem({ item, setCartItems, isSelected, onCheckboxChange, onShowPopup }) {
  const [isDeleting, setIsDeleting] = useState(false);

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
      onShowPopup({
        message: "Vui lòng đăng nhập để cập nhật giỏ hàng!",
        type: "warning",
        showCloseButton: false,
        confirmButton: {
          text: "Đăng nhập",
          onClick: () => (window.location.href = "/login"),
        },
        cancelButton: {
          text: "Đóng",
          onClick: () => onShowPopup(null),
        },
        className: cartStyles.popupOverlay,
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
      onShowPopup({
        message: `Số lượng tồn kho không đủ! Chỉ còn ${item.quantity} sản phẩm cho kích thước ${item.size}.`,
        type: "error",
        onClose: () => onShowPopup(null),
        className: cartStyles.popupOverlay,
      });
      return;
    }

    try {
      await updateCartItemQuantity(userId, item.id, item.size, newQuantity);
      setCartItems((prevItems) =>
        prevItems.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: newQuantity }
            : i
        )
      );
      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          JSON.parse(localStorage.getItem("cartItems") || "[]").map((i) =>
            i.id === item.id && i.size === item.size
              ? { ...i, quantity: newQuantity }
              : i
          )
        )
      );
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error updating quantity:", err);
      onShowPopup({
        message: "Không thể tăng số lượng. Vui lòng thử lại!",
        type: "error",
        onClose: () => onShowPopup(null),
        className: cartStyles.popupOverlay,
      });
    }
  };

  const handleRemove = async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem("userID");
    if (!userId) {
      onShowPopup({
        message: "Vui lòng đăng nhập để cập nhật giỏ hàng!",
        type: "warning",
        showCloseButton: false,
        confirmButton: {
          text: "Đăng nhập",
          onClick: () => (window.location.href = "/login"),
        },
        cancelButton: {
          text: "Đóng",
          onClick: () => onShowPopup(null),
        },
        className: cartStyles.popupOverlay,
      });
      return;
    }

    const newQuantity = item.quantity - 1;
    if (newQuantity < 1) {
      onShowPopup({
        message: "Số lượng tối thiểu là 1. Nếu muốn xóa, hãy nhấn nút Xóa!",
        type: "info",
        onClose: () => onShowPopup(null),
        className: cartStyles.popupOverlay,
      });
      return;
    }

    try {
      await updateCartItemQuantity(userId, item.id, item.size, newQuantity);
      setCartItems((prevItems) =>
        prevItems.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: newQuantity }
            : i
        )
      );
      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          JSON.parse(localStorage.getItem("cartItems") || "[]").map((i) =>
            i.id === item.id && i.size === item.size
              ? { ...i, quantity: newQuantity }
              : i
          )
        )
      );
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Error updating quantity:", err);
      onShowPopup({
        message: "Không thể giảm số lượng. Vui lòng thử lại!",
        type: "error",
        onClose: () => onShowPopup(null),
        className: cartStyles.popupOverlay,
      });
    }
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const userId = localStorage.getItem("userID");
      if (!userId) {
        onShowPopup({
          message: "Vui lòng đăng nhập để xóa sản phẩm!",
          type: "warning",
          showCloseButton: false,
          confirmButton: {
            text: "Đăng nhập",
            onClick: () => (window.location.href = "/login"),
          },
          cancelButton: {
            text: "Đóng",
            onClick: () => onShowPopup(null),
          },
          className: cartStyles.popupOverlay,
        });
        return;
      }

      await removeFromCart(userId, item.id, item.size);
      setCartItems((prevItems) =>
        prevItems.filter((i) => !(i.id === item.id && i.size === item.size))
      );
      localStorage.setItem(
        "cartItems",
        JSON.stringify(
          JSON.parse(localStorage.getItem("cartItems") || "[]").filter(
            (i) => !(i.id === item.id && i.size === item.size)
          )
        )
      );
      window.dispatchEvent(new Event("cartUpdated"));
      onShowPopup({
        message: `Đã xóa ${item.productName} (${item.size}) khỏi giỏ hàng!`,
        type: "success",
        onClose: () => onShowPopup(null),
        className: cartStyles.popupOverlay,
      });
    } catch (err) {
      console.error("Error removing item from cart:", err);
      onShowPopup({
        message:
          err.response?.data?.message ||
          "Không thể xóa sản phẩm. Vui lòng thử lại!",
        type: "error",
        onClose: () => onShowPopup(null),
        className: cartStyles.popupOverlay,
      });
    } finally {
      setIsDeleting(false);
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
          disabled={isDeleting}
        >
          Xóa
        </button>
      </div>
    </li>
  );
}

export default CartItem;