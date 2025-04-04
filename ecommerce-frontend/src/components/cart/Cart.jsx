// Cart.jsx
import React, { useState, useEffect } from "react";
import { getCart } from "../../services/api";
import CartItem from "./CartItem";
import styles from './Cart.module.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // useEffect(() => {
  //   const fetchCart = async () => {
  //     try {
  //       const response = await getCart();
  //       setCartItems(response.data);
  //     } catch (error) {
  //       console.error("Lỗi khi lấy giỏ hàng:", error);
  //     }
  //   };
  //   fetchCart();
  // }, []);

  // Tính tổng giá tiền của các sản phẩm được chọn
  const totalPrice = cartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  useEffect(() => {
    // Fake data để test nếu chưa gọi API thật
    const fakeData = [
      { id: 1, productName: "Áo thun", quantity: 2, price: 1000 },
      { id: 2, productName: "Quần jeans", quantity: 1, price: 1000 },
      { id: 3, productName: "Giày thể thao", quantity: 1, price: 1000 },
    ];
    setCartItems(fakeData);

    // Nếu dùng API thật:
    // const fetchCart = async () => {
    //   try {
    //     const response = await getCart();
    //     setCartItems(response.data);
    //   } catch (error) {
    //     console.error("Lỗi khi lấy giỏ hàng:", error);
    //   }
    // };
    // fetchCart();
  }, []);

  const handleProcessToPayment = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }
    // Logic xử lý thanh toán ở đây
    console.log("Processing payment for items:", selectedItems);
    // Ví dụ: chuyển hướng đến trang thanh toán
    // window.location.href = '/payment';
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>GIỎ HÀNG</h2>
      <div className={styles.divider}></div>
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
            <p className={styles.totalPrice}>
              Tổng tiền ({selectedItems.length} sản phẩm): {totalPrice.toLocaleString()} VNĐ
            </p>
            <button 
              className={styles.paymentButton}
              onClick={handleProcessToPayment}
            >
              Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;