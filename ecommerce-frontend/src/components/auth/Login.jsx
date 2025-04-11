import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import styles from "./Login.module.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null); // Thay popup bằng notification
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      setNotification({ message: "Đăng nhập thành công!", type: "success" });
      setTimeout(() => {
        setNotification(null);
        navigate("/");
      }, 2000);
    } catch (error) {
      let errorMsg = "Đăng nhập không thành công! Vui lòng kiểm tra lại.";
      if (error.response && error.response.data) {
        if (typeof error.response.data === "string") {
          errorMsg = error.response.data;
        } else if (error.response.data.error) {
          errorMsg = error.response.data.error;
        } else {
          errorMsg = JSON.stringify(error.response.data);
        }
      }
      setNotification({ message: errorMsg, type: "error" });
      setTimeout(() => setNotification(null), 3000); // Thông báo lỗi biến mất sau 3s
    }
  };

  const handleSocialLogin = (platform) => {
    setNotification({
      message: `Đăng nhập bằng ${platform} đang được phát triển!`,
      type: "error",
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
        <h3>Đăng nhập để tiếp tục</h3>
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
      {notification && (
        <div
          className={`${styles.notification} ${
            notification.type === "success"
              ? styles.notificationSuccess
              : styles.notificationError
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default Login;
