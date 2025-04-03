import React, { useState } from "react";
import { registerUser } from "../../services/auth";
import { useNavigate } from "react-router-dom"; // Thay useHistory bằng useNavigate

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Thay useHistory bằng useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ username, password });
      alert("Đăng ký thành công!");
      navigate("/login"); // Thay history.push bằng navigate
    } catch  {
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div>
      <h2>Đăng ký</h2>
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
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
}

export default Register;
