import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Popup from "../common/Popup";
import styles from "./Register.module.css";

function Register() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [popup, setPopup] = useState(null);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPopup({
        message: "Mật khẩu và mật khẩu xác nhận không khớp!",
        type: "error",
      });
      return;
    }
    try {
      await register(username, password, phone, address, fullName, "");
      setPopup({ message: "Đăng ký thành công!", type: "success" });
      setTimeout(() => {
        setPopup(null);
        navigate("/login");
      }, 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data ||
        "Đăng ký không thành công! Vui lòng kiểm tra lại.";
      setPopup({ message: errorMsg, type: "error" });
    }
  };

  const closePopup = () => setPopup(null);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Register</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <FaUser className={styles.icon} />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Họ và tên"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputWrapper}>
            <FaUser className={styles.icon} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên đăng nhập"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputWrapper}>
            <FaLock className={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              required
              className={styles.input}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeIcon}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className={styles.inputWrapper}>
            <FaLock className={styles.icon} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Xác nhận mật khẩu"
              required
              className={styles.input}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={styles.eyeIcon}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className={styles.inputWrapper}>
            <FaPhone className={styles.icon} />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.inputWrapper}>
            <FaMapMarkerAlt className={styles.icon} />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Địa chỉ"
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Đăng ký
          </button>
        </form>
        <div className={styles.loginContainer}>
          <p>Bạn đã có tài khoản?</p>
          <Link to="/login" className={styles.loginButton}>
            Đăng nhập
          </Link>
        </div>
      </div>
      {popup && (
        <Popup message={popup.message} type={popup.type} onClose={closePopup} />
      )}
    </div>
  );
}

export default Register;