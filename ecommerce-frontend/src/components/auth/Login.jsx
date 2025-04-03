import React, { useState, useContext } from "react";
import { loginUser } from "../../services/auth";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Thay useHistory bằng useNavigate

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // Thay useHistory bằng useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ username, password });
      login(response.data, username);
      alert("Đăng nhập thành công!");
      navigate("/products"); // Thay history.push bằng navigate
    } catch {
      alert("Đăng nhập thất bại!");
    }
  };

  return (
    <div>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tên người dùng"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;
