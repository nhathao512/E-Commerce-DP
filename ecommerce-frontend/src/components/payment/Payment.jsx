import React, { useState, useEffect } from "react";
import { processPayment } from "../../services/api";
import styles from "./Payment.module.css";
import logo from "../../assets/banking.png";

function Payment() {
  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    voucher: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: ""
  });
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [transferCode, setTransferCode] = useState("");

  // Danh sách sản phẩm mẫu (có thể thay bằng dữ liệu thực từ API hoặc props)
  const cartItems = [
    {
      id: 1,
      name: "Áo thun nam cao cấp",
      quantity: 2,
      price: 200000,
      image: "https://via.placeholder.com/60" // Ảnh mẫu
    },
    {
      id: 2,
      name: "Quần jeans nam",
      quantity: 1,
      price: 300000,
      image: "https://via.placeholder.com/60" // Ảnh mẫu
    }
  ];

  // Generate random transfer code when bank method is selected
  useEffect(() => {
    if (method === "bank") {
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setTransferCode(randomCode);
      setTimeLeft(300); // Reset timer to 5 minutes
    }
  }, [method]);

  // Countdown timer effect
  useEffect(() => {
    if (method === "bank" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [method, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    try {
      await processPayment({
        method,
        transferCode: method === "bank" ? transferCode : undefined,
        ...formData
      });
      alert("Thanh toán thành công!");
    } catch {
      alert("Thanh toán thất bại!");
    }
  };

  const handleVoucherAccept = () => {
    if (formData.voucher) {
      alert(`Đã áp dụng voucher: ${formData.voucher}`);
    }
  };

  const paymentDetails = {
    subtotal: 500000,
    shipping: 30000,
    total: 530000
  };

  return (
    <div className={styles.paymentContainer}>
      <h2 className={styles.title}>Thanh Toán</h2>
      <div className={styles.contentWrapper}>
        <div className={styles.paymentForm}>
          <div className={styles.formSection}>
            <h3>Thông tin khách hàng</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Họ và tên"
              className={styles.input}
              required
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Số điện thoại"
              className={styles.input}
              required
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Địa chỉ giao hàng"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formSection}>
            <h3>Phương thức thanh toán</h3>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className={styles.select}
            >
              <option value="cod">Thanh toán khi nhận hàng</option>
              <option value="bank">Chuyển khoản</option>
              <option value="credit">Thẻ tín dụng</option>
            </select>

            {method === "bank" && (
              <div className={styles.bankInfo}>
                <img 
                  src={logo}
                  alt="Banking Info"
                  className={styles.bankImage}
                />
                <div className={styles.timerContainer}>
                  <span className={styles.timerText}>
                    Mã sẽ hết hạn trong vòng: {formatTime(timeLeft)}
                  </span>
                  <div className={styles.codeWrapper}>
                    <span className={styles.transferCode}>
                      Mã chuyển khoản: {transferCode}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(transferCode);
                        alert("Đã sao chép mã: " + transferCode);
                      }}
                      className={styles.copyButton}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {method === "credit" && (
              <div className={styles.creditForm}>
                <h4 className={styles.creditTitle}>Thẻ Tín Dụng</h4>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="Số thẻ"
                  className={styles.input}
                  required
                />
                <div className={styles.creditDetails}>
                  <input
                    type="text"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className={styles.input}
                    required
                  />
                  <input
                    type="text"
                    name="cardCVC"
                    value={formData.cardCVC}
                    onChange={handleInputChange}
                    placeholder="CVC"
                    className={styles.input}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <div className={styles.formSection}>
            <h3>Mã giảm giá</h3>
            <div className={styles.voucherContainer}>
              <input
                type="text"
                name="voucher"
                value={formData.voucher}
                onChange={handleInputChange}
                placeholder="Nhập mã voucher"
                className={styles.input}
              />
              <button
                onClick={handleVoucherAccept}
                className={styles.voucherButton}
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>

        <div className={styles.paymentSummary}>
          <h3>Tóm tắt thanh toán</h3>
          <div className={styles.cartItems}>
            <h4 className={styles.cartTitle}>Sản phẩm</h4>
            {cartItems.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.cartItemImage}
                />
                <div className={styles.cartItemDetails}>
                  <span className={styles.cartItemName}>{item.name}</span>
                  
                  <span className={styles.cartItemQuantity}>
                    Số lượng: {item.quantity}
                  </span>
                  <span className={styles.cartItemSize}>Kích thước: {item.size}</span>
                  <span className={styles.cartItemPrice}>
                    {(item.price * item.quantity).toLocaleString()} VNĐ
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.summaryItem}>
            <span>Tổng tiền hàng:</span>
            <span>{paymentDetails.subtotal.toLocaleString()} VNĐ</span>
          </div>
          <div className={styles.summaryItem}>
            <span>Phí vận chuyển:</span>
            <span>{paymentDetails.shipping.toLocaleString()} VNĐ</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Tổng thanh toán:</span>
            <span>{paymentDetails.total.toLocaleString()} VNĐ</span>
          </div>
          <button
            onClick={handlePayment}
            className={styles.paymentButton}
          >
            Hoàn tất thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;