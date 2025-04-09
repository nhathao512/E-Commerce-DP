import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import Popup from "../common/Popup";
import styles from "./Login.module.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      setPopup({ message: "Đăng nhập thành công!", type: "success" });
      setTimeout(() => {
        setPopup(null);
        navigate("/");
      }, 2000);
    } catch (error) {
      // Xử lý lỗi để đảm bảo message là chuỗi
      let errorMsg = "Đăng nhập không thành công! Vui lòng kiểm tra lại.";
      if (error.response && error.response.data) {
        if (typeof error.response.data === "string") {
          errorMsg = error.response.data;
        } else if (error.response.data.error) {
          errorMsg = error.response.data.error; // Lấy trường error nếu có
        } else {
          errorMsg = JSON.stringify(error.response.data); // Chuyển object thành chuỗi nếu cần
        }
      }
      setPopup({ message: errorMsg, type: "error" });
    }
  };

  const handleSocialLogin = (platform) => {
    setPopup({
      message: `Đăng nhập bằng ${platform} đang được phát triển!`,
      type: "error",
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const closePopup = () => setPopup(null);

  return (
    <div className={styles.container}>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.formWrapper}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/")}
          title="Quay lại trang chủ"
        >
          <FaArrowLeft />
        </button>
        <h2 className={styles.title}>Welcome back!</h2>
        <h3>Login to continue</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tên đăng nhập"
            className={styles.input}
            required
          />
          <div className={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className={styles.input}
              required
            />
            <button
              type="button"
              className={styles.togglePassword}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            className={styles.forgotPassword}
            type="button"
            onClick={() => navigate("/forgot-password")}
          >
            Quên mật khẩu?
          </button>
          <button type="submit" className={styles.loginButton}>
            Đăng nhập
          </button>
        </form>
        <div className={styles.orLogin}>
          <span>Hoặc đăng nhập</span>
        </div>
        <div className={styles.socialLogin}>
          <button
            className={styles.googleButton}
            onClick={() => handleSocialLogin("Google")}
          >
            Google
          </button>
          <button
            className={styles.facebookButton}
            onClick={() => handleSocialLogin("Facebook")}
          >
            Facebook
          </button>
          <button
            className={styles.twitterButton}
            onClick={() => handleSocialLogin("Twitter")}
          >
            Twitter
          </button>
        </div>
        <div className={styles.registerContainer}>
          <p>Không có tài khoản?</p>
          <button
            className={styles.registerButton}
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </button>
        </div>
      </div>
      {popup && (
        <Popup message={popup.message} type={popup.type} onClose={closePopup} />
      )}
    </div>
  );
}

export default Login;
