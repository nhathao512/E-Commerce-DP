import React, { useState } from "react";
import { processPayment } from "../../services/api";

function Payment() {
  const [method, setMethod] = useState("bank");

  const handlePayment = async () => {
    try {
      await processPayment(method);
      alert("Thanh toán thành công!");
    } catch  {
      alert("Thanh toán thất bại!");
    }
  };

  return (
    <div>
      <h2>Thanh toán</h2>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="bank">Chuyển khoản</option>
        <option value="credit">Thẻ tín dụng</option>
      </select>
      <button onClick={handlePayment}>Thanh toán</button>
    </div>
  );
}

export default Payment;
