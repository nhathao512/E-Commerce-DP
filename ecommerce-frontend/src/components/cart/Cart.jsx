import React, { useState, useEffect } from "react";
import CartItem from "./CartItem";
import styles from "./Cart.module.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCartItems && storedCartItems.length > 0) {
      setCartItems(storedCartItems);
    } else {
      const fakeData = [
        { id: 1, productName: "Áo thun", quantity: 2, price: 1000 },
        { id: 2, productName: "Quần jeans", quantity: 1, price: 1000 },
        { id: 3, productName: "Giày thể thao", quantity: 1, price: 1000 },
        { id: 4, productName: "Giày thể thao", quantity: 1, price: 1000 },
        { id: 5, productName: "Giày thể thao", quantity: 1, price: 1000 },
        { id: 6, productName: "Giày thể thao", quantity: 1, price: 1000 },
      ];
      setCartItems(fakeData);
      localStorage.setItem("cartItems", JSON.stringify(fakeData));
    }
  }, []);

  // Cập nhật localStorage và phát sự kiện khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    window.dispatchEvent(new Event("cartUpdated")); // Phát sự kiện tùy chỉnh
  }, [cartItems]);

  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );
  const totalPrice = selectedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const handleProcessToPayment = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }
    console.log("Processing payment for items:", selectedItems);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>GIỎ HÀNG</h2>
      <div className={styles.divider}></div>

      {cartItems.length > 0 && (
        <div className={styles.selectAll}>
          <input
            type="checkbox"
            checked={
              selectedItems.length === cartItems.length && cartItems.length > 0
            }
            onChange={handleSelectAll}
            className={styles.checkbox}
          />
          <label>Chọn tất cả ({cartItems.length} sản phẩm)</label>
        </div>
      )}

      {cartItems.length === 0 ? (
        <p className={styles.emptyCart}>Giỏ hàng trống</p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                setCartItems={setCartItems}
                isSelected={selectedItems.includes(item.id)}
                onCheckboxChange={() => handleCheckboxChange(item.id)}
              />
            ))}
          </ul>
          <div className={styles.summary}>
            <div className={styles.summaryDetails}>
              <div className={styles.summaryHeader}>
                <span>Mặt hàng</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
              </div>
              {selectedCartItems.length > 0 ? (
                selectedCartItems.map((item) => (
                  <div key={item.id} className={styles.summaryItem}>
                    <span>{item.productName}</span>
                    <span>{item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()} VNĐ</span>
                  </div>
                ))
              ) : (
                <p className={styles.noItems}>Chưa chọn sản phẩm nào</p>
              )}
              <div className={styles.summaryTotal}>
                <div className={styles.totalWrapper}>
                  <span>Tổng tiền: {totalPrice.toLocaleString()} VNĐ</span>
                  <span></span>
                  <button
                    className={styles.paymentButton}
                    onClick={handleProcessToPayment}
                    disabled={!selectedItems.length}
                  >
                    Thanh toán
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;