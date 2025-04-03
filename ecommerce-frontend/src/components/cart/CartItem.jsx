import React from "react";

function CartItem({ item }) {
  return (
    <li style={{ margin: "10px 0" }}>
      {item.productName} - Số lượng: {item.quantity}
    </li>
  );
}

export default CartItem;
