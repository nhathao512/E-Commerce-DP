import React from "react";
import { addToCart } from "../../services/api";

function ProductItem({ product }) {
  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      alert("Đã thêm vào giỏ hàng!");
    } catch {
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "10px",
        width: "200px",
      }}
    >
      <h3>{product.name}</h3>
      <p>Giá: ${product.price}</p>
      <button onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
    </div>
  );
}

export default ProductItem;
