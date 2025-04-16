import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { processPayment, getProvinces } from "../../services/api";
import styles from "./Payment.module.css";
import logo from "../../assets/banking.png";
import Popup from "../common/Popup";

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
  const [popup, setPopup] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCartItems = [], totalPrice = 0 } = location.state || {};
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setPopup({
        message: "Vui lòng đăng nhập để tiếp tục thanh toán!",
        type: "warning",
        onClose: () => {
          setPopup(null);
          navigate("/login");
        },
        showCloseButton: false,
        confirmButton: {
          text: "Đăng nhập",
          onClick: () => navigate("/login"),
        },
        cancelButton: {
          text: "Đóng",
          onClick: () => setPopup(null),
        },
        className: styles.popupOverlay,
      });
    }
  }, [isAuthenticated, isLoading, navigate]);

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
    if (name === "phone" || name === "cardNumber" || name === "cardCVC") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === "cardExpiry") {
      let numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length >= 3) {
        numericValue = `${numericValue.slice(0, 2)}/${numericValue.slice(
          2,
          4
        )}`;
      }
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.name) {
      setPopup({
        message: "Vui lòng nhập họ và tên!",
        type: "error",
        onClose: () => setPopup(null),
        className: styles.popupOverlay,
      });
      return false;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setPopup({
        message: "Vui lòng nhập số điện thoại hợp lệ (10 chữ số)!",
        type: "error",
        onClose: () => setPopup(null),
        className: styles.popupOverlay,
      });
      return false;
    }
    if (!formData.province || !formData.district || !formData.ward) {
      setPopup({
        message: "Vui lòng chọn đầy đủ tỉnh/thành, quận/huyện, phường/xã!",
        type: "error",
        onClose: () => setPopup(null),
        className: styles.popupOverlay,
      });
      return false;
    }
    if (!formData.detailedAddress) {
      setPopup({
        message: "Vui lòng nhập địa chỉ chi tiết!",
        type: "error",
        onClose: () => setPopup(null),
        className: styles.popupOverlay,
      });
      return false;
    }
    if (method === "credit") {
      if (formData.cardNumber.length < 16) {
        setPopup({
          message: "Số thẻ tín dụng phải có ít nhất 16 chữ số!",
          type: "error",
          onClose: () => setPopup(null),
          className: styles.popupOverlay,
        });
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
        setPopup({
          message: "Ngày hết hạn phải có định dạng MM/YY!",
          type: "error",
          onClose: () => setPopup(null),
          className: styles.popupOverlay,
        });
        return false;
      }
      if (formData.cardCVC.length < 3 || formData.cardCVC.length > 4) {
        setPopup({
          message: "Mã CVC phải có 3 hoặc 4 chữ số!",
          type: "error",
          onClose: () => setPopup(null),
          className: styles.popupOverlay,
        });
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      setPopup({
        message: "Vui lòng đăng nhập để tiếp tục!",
        type: "warning",
        onClose: () => {
          setPopup(null);
          navigate("/login");
        },
        className: styles.popupOverlay,
      });
      return;
    }

    const userId = localStorage.getItem("userID");
    if (!userId) {
      setPopup({
        message: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!",
        type: "error",
        onClose: () => {
          setPopup(null);
          navigate("/login");
        },
        className: styles.popupOverlay,
      });
      return;
    }

    if (selectedCartItems.length === 0) {
      setPopup({
        message: "Không có sản phẩm nào để thanh toán!",
        type: "error",
        onClose: () => setPopup(null),
        className: styles.popupOverlay,
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const fullAddress = `${formData.detailedAddress}, ${formData.ward}, ${formData.district}, ${formData.province}`;
      const paymentData = {
        userId,
        method,
        transferCode: method === "bank" ? transferCode : undefined,
        items: selectedCartItems,
        total: totalPrice,
        name: formData.name,
        phone: formData.phone,
        address: fullAddress,
        voucher: formData.voucher || undefined,
        cardNumber: method === "credit" ? formData.cardNumber : undefined,
        cardExpiry: method === "credit" ? formData.cardExpiry : undefined,
        cardCVC: method === "credit" ? formData.cardCVC : undefined,
      };
      await processPayment(paymentData);
      setPopup({
        message: "Thanh toán thành công! Cảm ơn bạn đã mua sắm.",
        type: "success",
        onClose: () => {
          setPopup(null);
          navigate("/");
          window.location.reload();
        },
        duration: 3000,
        showCloseButton: true,
        className: styles.popupOverlay,
      });
    } catch (error) {
      console.error("Thanh toán thất bại:", error);
      setPopup({
        message:
          error.response?.data?.message ||
          "Thanh toán thất bại! Vui lòng thử lại.",
        type: "error",
        onClose: () => setPopup(null),
        className: styles.popupOverlay,
      });
    }
  };

  const handleVoucherAccept = () => {
    if (formData.voucher) {
      setPopup({
        message: `Đã áp dụng voucher: ${formData.voucher}`,
        type: "success",
        onClose: () => setPopup(null),
        className: styles.popupOverlay,
      });
    }
    // Không hiển thị thông báo nếu không nhập voucher
  };

  const paymentDetails = {
    subtotal: totalPrice,
    shipping: 30000,
    total: totalPrice + 30000,
  };

  if (isLoading) {
    return <div className={styles.container}>Đang tải...</div>;
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
              maxLength={10}
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
                        setPopup({
                          message: `Đã sao chép mã: ${transferCode}`,
                          type: "success",
                          onClose: () => setPopup(null),
                          className: styles.popupOverlay,
                        });
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
                  placeholder="Số thẻ (16 chữ số)"
                  className={styles.input}
                  required
                  maxLength={16}
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
                    maxLength={5}
                  />
                  <input
                    type="text"
                    name="cardCVC"
                    value={formData.cardCVC}
                    onChange={handleInputChange}
                    placeholder="CVC (3-4 chữ số)"
                    className={styles.input}
                    required
                    maxLength={4}
                  />
                </div>
              </div>
            )}
          </div>

          <div className={styles.formSection}>
            <h3>Mã giảm giá (tùy chọn)</h3>
            <div className={styles.voucherContainer}>
              <input
                type="text"
                name="voucher"
                value={formData.voucher}
                onChange={handleInputChange}
                placeholder="Nhập mã voucher nếu có"
                className={styles.input}
              />
              {formData.voucher && (
                <button
                  onClick={handleVoucherAccept}
                  className={styles.voucherButton}
                >
                  Áp dụng
                </button>
              )}
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

      {popup && <Popup {...popup} />}
    </div>
  );
}

export default Payment;
