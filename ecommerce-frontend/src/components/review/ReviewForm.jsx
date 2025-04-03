import React, { useState } from "react";
import { addReview } from "../../services/api";

function ReviewForm() {
  const [productId, setProductId] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview({ productId, content, rating });
      alert("Đánh giá thành công!");
    } catch {
      alert("Đánh giá thất bại!");
    }
  };

  return (
    <div>
      <h2>Gửi đánh giá</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="ID sản phẩm"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nội dung đánh giá"
          required
        />
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>
        <button type="submit">Gửi đánh giá</button>
      </form>
    </div>
  );
}

export default ReviewForm;
