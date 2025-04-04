// Login.jsx
import React, { useState, useContext } from "react";
import { loginUser } from "../../services/auth";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa"; // Thêm FaArrowLeft
import styles from "./Login.module.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password });
      login(response.data, username);
      alert("Đăng nhập thành công!");
      navigate("/products");
    } catch {
      alert("Đăng nhập không thành công!");
    }
  };

  const handleSocialLogin = (platform) => {
    alert(`Đăng nhập bằng ${platform} đang được phát triển!`);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundOverlay}></div>
      <div className={styles.formWrapper}>
        {/* Nút Back to Home */}
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
    </div>
  );
}

export default Login;