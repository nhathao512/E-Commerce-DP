import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext
import { processPayment, getProvinces } from "../../services/api";
import styles from "./Payment.module.css";
import logo from "../../assets/banking.png";

function Payment() {
  const [method, setMethod] = useState("cod");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    detailedAddress: "",
    voucher: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });
  const [timeLeft, setTimeLeft] = useState(300);
  const [transferCode, setTransferCode] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCartItems = [], totalPrice = 0 } = location.state || {};

  // Lấy thông tin từ AuthContext
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      alert("Vui lòng đăng nhập để tiếp tục thanh toán!");
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Lấy danh sách tỉnh/thành phố
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingProvinces(true);
        setErrorMessage("");
        const response = await getProvinces();
        setProvinces(Array.isArray(response.data) ? response.data : []);
        if (!Array.isArray(response.data) || response.data.length === 0) {
          setErrorMessage(
            "Không thể tải danh sách tỉnh/thành phố. Vui lòng thử lại sau."
          );
        }
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
        setProvinces([]);
        setErrorMessage(
          "Đã xảy ra lỗi khi tải danh sách tỉnh/thành phố: " + error.message
        );
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Lấy danh sách quận/huyện
  useEffect(() => {
    if (formData.province) {
      const selectedProvince = provinces.find(
        (p) => p.name === formData.province
      );
      setDistricts(
        Array.isArray(selectedProvince?.district)
          ? selectedProvince.district
          : []
      );
      setFormData((prev) => ({ ...prev, district: "", ward: "" }));
      setWards([]);
      setLoadingDistricts(false);
    }
  }, [formData.province, provinces]);

  // Lấy danh sách phường/xã
  useEffect(() => {
    if (formData.district) {
      const selectedDistrict = districts.find(
        (d) => d.name === formData.district
      );
      setWards(
        Array.isArray(selectedDistrict?.ward) ? selectedDistrict.ward : []
      );
      setFormData((prev) => ({ ...prev, ward: "" }));
      setLoadingWards(false);
    }
  }, [formData.district, districts]);

  // Tạo mã chuyển khoản ngẫu nhiên
  useEffect(() => {
    if (method === "bank") {
      const randomCode = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      setTransferCode(randomCode);
      setTimeLeft(300);
    }
  }, [method]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (method === "bank" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
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
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để tiếp tục!");
      navigate("/login");
      return;
    }

    // Lấy userId từ localStorage (đã được đồng bộ trong AuthProvider)
    const userId = localStorage.getItem("userId");

    try {
      const fullAddress = `${formData.detailedAddress}, ${formData.ward}, ${formData.district}, ${formData.province}`;
      const paymentData = {
        userId: userId,
        method,
        transferCode: method === "bank" ? transferCode : undefined,
        items: selectedCartItems,
        total: totalPrice,
        name: formData.name,
        phone: formData.phone,
        address: fullAddress,
        voucher: formData.voucher,
        cardNumber: method === "credit" ? formData.cardNumber : undefined,
        cardExpiry: method === "credit" ? formData.cardExpiry : undefined,
        cardCVC: method === "credit" ? formData.cardCVC : undefined,
      };
      await processPayment(paymentData);
      alert("Thanh toán thành công!");
      navigate("/"); // Chuyển hướng về trang chủ
    } catch (error) {
      console.error("Thanh toán thất bại:", error);
      alert("Thanh toán thất bại! Vui lòng thử lại.");
    }
  };

  const handleVoucherAccept = () => {
    if (formData.voucher) {
      alert(`Đã áp dụng voucher: ${formData.voucher}`);
    } else {
      alert("Vui lòng nhập mã voucher!");
    }
  };

  const paymentDetails = {
    subtotal: totalPrice,
    shipping: 30000,
    total: totalPrice + 30000,
  };

  // Nếu đang tải trạng thái xác thực, hiển thị loading
  if (isLoading) {
    return <div>Đang tải...</div>;
  }

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
            <label>Tỉnh/Thành phố</label>
            {loadingProvinces ? (
              <p>Đang tải danh sách tỉnh/thành phố...</p>
            ) : (
              <>
                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  {provinces.map((province) => (
                    <option
                      key={province.code || province.id}
                      value={province.name}
                    >
                      {province.name}
                    </option>
                  ))}
                </select>
              </>
            )}
            <label>Quận/Huyện</label>
            {loadingDistricts ? (
              <p>Đang tải danh sách quận/huyện...</p>
            ) : (
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className={styles.select}
                required
                disabled={!formData.province}
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map((district) => (
                  <option
                    key={district.code || district.id}
                    value={district.name}
                  >
                    {district.name}
                  </option>
                ))}
              </select>
            )}
            <label>Phường/Xã</label>
            {loadingWards ? (
              <p>Đang tải danh sách phường/xã...</p>
            ) : (
              <select
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                className={styles.select}
                required
                disabled={!formData.district}
              >
                <option value="">Chọn phường/xã</option>
                {wards.map((ward) => (
                  <option key={ward.code || ward.id} value={ward.name}>
                    {ward.name}
                  </option>
                ))}
              </select>
            )}
            <input
              type="text"
              name="detailedAddress"
              value={formData.detailedAddress}
              onChange={handleInputChange}
              placeholder="Địa chỉ chi tiết (số nhà, đường)"
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
            {selectedCartItems.length > 0 ? (
              selectedCartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className={styles.cartItem}
                >
                  <img
                    src={item.imageUrl || "https://via.placeholder.com/60"}
                    alt={item.productName}
                    className={styles.cartItemImage}
                  />
                  <div className={styles.cartItemDetails}>
                    <span className={styles.cartItemName}>
                      {item.productName}
                    </span>
                    <span className={styles.cartItemQuantity}>
                      Số lượng: {item.quantity}
                    </span>
                    <span className={styles.cartItemSize}>
                      Kích thước: {item.size}
                    </span>
                    <span className={styles.cartItemPrice}>
                      {(item.price * item.quantity).toLocaleString()} VNĐ
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có sản phẩm nào để thanh toán.</p>
            )}
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
          <button onClick={handlePayment} className={styles.paymentButton}>
            Hoàn tất thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
