import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <nav style={{ background: "#333", padding: "10px", color: "white" }}>
      <Link to="/products" style={{ color: "white", marginRight: "10px" }}>
        Sản phẩm
      </Link>
      <Link to="/cart" style={{ color: "white", marginRight: "10px" }}>
        Giỏ hàng
      </Link>
      <Link to="/payment" style={{ color: "white", marginRight: "10px" }}>
        Thanh toán
      </Link>
      <Link to="/review" style={{ color: "white", marginRight: "10px" }}>
        Đánh giá
      </Link>
      <Link to="/reviews" style={{ color: "white", marginRight: "10px" }}>
        Xem đánh giá
      </Link>
      {isAuthenticated ? (
        <>
          <span style={{ color: "white", marginRight: "10px" }}>
            Xin chào, {user?.username}
          </span>
          <button
            onClick={logout}
            style={{ color: "white", background: "none", border: "none" }}
          >
            Đăng xuất
          </button>
        </>
      ) : (
        <>
          <Link to="/register" style={{ color: "white", marginRight: "10px" }}>
            Đăng ký
          </Link>
          <Link to="/login" style={{ color: "white" }}>
            Đăng nhập
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
