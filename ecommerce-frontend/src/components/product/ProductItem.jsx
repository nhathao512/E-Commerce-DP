import React from "react";
import { addToCart } from "../../services/api";
import styles from "./ProductItem.module.css";
import { useNavigate } from "react-router-dom";
import  {jwtDecode} from "jwt-decode";

function ProductItem({ product }) {
  const navigate = useNavigate();
  const API_URL = "http://localhost:8080/api";
  const token = localStorage.getItem("token");

  const handleAddToCart = async () => {
    try {
      
      
      // Gọi API backend để thêm vào giỏ hàng
      if (!token) {
        alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
        return;
      }
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      const userId = decodedToken.userId;
      await addToCart(product, 1, product.sizes[0], userId);

      // Cập nhật localStorage để hiển thị tức thời
      let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        alert("Sản phẩm đã có trong giỏ hàng");
      } else {
        cartItems.push({
          id: product.id,
          productName: product.name,
          imageUrl:
            product.images && product.images.length > 0
              ? `${API_URL}/images/${product.images[0]}`
              : null,
          price: product.price,
          quantity: 1,
          size: product.sizes[0],
        });
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        alert("Đã thêm vào giỏ hàng!");
      }

      // Dispatch sự kiện để cập nhật Navbar
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding to cart:", error.response || error);
      alert("Thêm vào giỏ hàng thất bại!");
      console.log("Product data:", product);
    }
  };

  const handleProductDetail = () => {
    navigate(`/product/${product.id}`);
  };

  console.log("ProductItem received product:", product);

  const imageUrl =
    product.images && product.images.length > 0
      ? `${API_URL}/images/${product.images[0]}`
      : "https://placehold.co/600x400";

  console.log("Image URL:", imageUrl);

  return (
    <div className={styles.card} onClick={handleProductDetail}>
      <div className={styles.imageWrapper}>
        <img
          src={imageUrl}
          alt={product.name || "Product Image"}
          className={styles.image}
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400";
            console.error("Image failed to load:", imageUrl);
          }}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{product.name || "Unnamed Product"}</h3>
        <p className={styles.description}>
          {product.description || "No description available"}
        </p>
        <div className={styles.priceWrapper}>
          <span className={styles.price}>
            {product.price
              ? product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
                " VNĐ"
              : "0.00 VNĐ"}
          </span>
        </div>
        <button
          className={styles.addButton}
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}

export default ProductItem;