import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetail.module.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState([]); // State cho danh sách bình luận
  const [newComment, setNewComment] = useState(""); // State cho bình luận mới
  const [rating, setRating] = useState(0); // State cho đánh giá sao

  useEffect(() => {
    const fetchProduct = async () => {
        try {
          const response = await new Promise((resolve) =>
            setTimeout(() => {
              resolve({
                id,
                name: `NABNAG TEE - YELLOW`,
                price: 395000,
                categoryId: "C001",
                imageUrl: "https://placehold.co/600x400/FF6B6B/FFFFFF?text=Main+Image",
                additionalImages: [
                  "https://placehold.co/600x400/4ECDC4/FFFFFF?text=Image+1",
                  "https://placehold.co/600x400/45B7D1/FFFFFF?text=Image+2",
                  "https://placehold.co/600x400/FF9F1C/FFFFFF?text=Image+3",
                  "https://placehold.co/600x400/2AB7CA/FFFFFF?text=Image+4",
                ],
                brand: "NEEDS OF WISDOM®",
                status: "Còn hàng",
                sizes: ["S", "M", "L", "XL"],
                description: `
                  Áo thun NABNAG TEE - YELLOW từ NEEDS OF WISDOM® là một sản phẩm streetwear cao cấp, được thiết kế và sản xuất tại Việt Nam. Với chất liệu cotton 100% cao cấp, áo mang lại cảm giác thoải mái, thoáng mát và bền bỉ. Màu vàng nổi bật cùng thiết kế tối giản nhưng hiện đại, sản phẩm này phù hợp cho cả nam và nữ, dễ dàng phối đồ trong nhiều phong cách khác nhau. Sản phẩm được sản xuất tại Sài Gòn, đảm bảo chất lượng và sự tỉ mỉ trong từng đường kim mũi chỉ.
                  
                  - Chất liệu: 100% cotton  
                  - Form dáng: Regular fit  
                  - Phù hợp: Mặc hàng ngày, dạo phố, hoặc các hoạt động ngoài trời  
                  - Hướng dẫn bảo quản: Giặt máy ở nhiệt độ dưới 30°C, không sử dụng chất tẩy mạnh, phơi khô tự nhiên.
                `,
              });
            }, 500)
          );
      
          setProduct(response);
          setLoading(false);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
          setLoading(false);
        }
      };

    // Giả lập fetch danh sách bình luận
    const fetchComments = async () => {
      try {
        const response = await new Promise((resolve) =>
          setTimeout(() => {
            resolve([
              {
                id: "1",
                user: "Nguyễn Văn A",
                content: "Áo rất đẹp, chất lượng tốt!",
                date: "2025-04-01",
                rating: 5, // Thêm rating
              },
              {
                id: "2",
                user: "Trần Thị B",
                content: "Màu sắc rất nổi bật, mình rất thích!",
                date: "2025-04-02",
                rating: 4, // Thêm rating
              },
            ]);
          }, 500)
        );

        setComments(response);
      } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
      }
    };

    fetchProduct();
    fetchComments();
  }, [id]);

  const getSliderImages = () => {
    if (!product) return [];
    const images = [product.imageUrl, ...(product.additionalImages || [])];
    return images.slice(0, 5);
  };

  const sliderImages = getSliderImages();

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Vui lòng chọn kích thước!");
      return;
    }
    alert(`Đã thêm ${quantity} sản phẩm ${product.name} (kích thước: ${selectedSize}) vào giỏ hàng!`);
  };

  const handleRating = (star) => {
    setRating(star);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      alert("Vui lòng nhập nội dung bình luận!");
      return;
    }
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá!");
      return;
    }

    const newCommentObj = {
      id: String(comments.length + 1),
      user: "Người dùng", // Trong thực tế, lấy từ thông tin người dùng đăng nhập
      content: newComment,
      date: new Date().toISOString().split("T")[0],
      rating, // Thêm rating vào bình luận
    };

    setComments([...comments, newCommentObj]);
    setNewComment(""); // Reset form
    setRating(0); // Reset rating
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner}></div>
        <span className={styles.loadingText}>Đang tải...</span>
      </div>
    );
  }

  if (!product) {
    return <div>Không tìm thấy sản phẩm!</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.productWrapper}>
        {/* Phần ảnh sản phẩm */}
        <div className={styles.imageSection}>
            <div className={styles.mainImage}>
                <img src={sliderImages[currentSlide]} alt={product.name} />
                {/* Thêm các nút sliderArrow vào đây */}
                <button className={styles.sliderArrow} onClick={handlePrevSlide}>
                ❮
                </button>
                <button className={styles.sliderArrow} onClick={handleNextSlide}>
                ❯
                </button>
            </div>
            <div className={styles.thumbnailSlider}>
                <div className={styles.thumbnailWrapper}>
                {sliderImages.map((img, index) => (
                    <img
                    key={index}
                    src={img}
                    alt={`${product.name} - Image ${index + 1}`}
                    className={`${styles.thumbnail} ${
                        currentSlide === index ? styles.activeThumbnail : ""
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    />
                ))}
                </div>
            </div>
            </div>

        {/* Phần thông tin sản phẩm */}
        <div className={styles.infoSection}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.brand}>
            Thương hiệu: <span>{product.brand}</span> | Tình trạng:{" "}
            <span>{product.status}</span>
          </p>
          <p className={styles.price}>
            {product.price.toLocaleString("vi-VN")}đ
          </p>
          <p className={styles.description}>
            ECOMMERCE / Streetfighter / Based in TDTU / Made in Vietnam
          </p>


          {/* Phần có thể thay đổi tùy theo dạng product đang được xét đến nên lưu ý*/}
          <div className={styles.sizeSection}>
            <p>Kích thước</p>
            <div className={styles.sizeOptions}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeButton} ${
                    selectedSize === size ? styles.selectedSize : ""
                  }`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* Phần có thể thay đổi tùy theo dạng product đang được xét đến nên lưu ý*/}




          <div className={styles.quantitySection}>
            <p>Số lượng:</p>
            <div className={styles.quantityControl}>
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
          </div>

          <button className={styles.addToCartButton} onClick={handleAddToCart}>
            THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </div>
    
        {/* Phần mô tả sản phẩm */}
        <div className={styles.descriptionSection}>
            <h2 className={styles.descriptionTitle}>Mô tả sản phẩm</h2>
            <div className={styles.descriptionContent}>
            {product.description.split("\n").map((line, index) => (
                <p key={index}>{line.trim()}</p>
            ))}
            </div>
        </div>
      {/* Phần bình luận */}
      <div className={styles.commentSection}>
        <h2 className={styles.commentTitle}>Bình luận</h2>

        {/* Form nhập bình luận */}
        <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
          <div className={styles.ratingSection}>
            <p>Đánh giá:</p>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${
                    star <= rating ? styles.starFilled : ""
                  }`}
                  onClick={() => handleRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <textarea
            className={styles.commentInput}
            placeholder="Viết bình luận của bạn..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className={styles.submitButton}>
            Gửi bình luận
          </button>
        </form>

        {/* Danh sách bình luận */}
        <div className={styles.commentList}>
          {comments.length === 0 ? (
            <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className={styles.commentItem}>
                <p className={styles.commentUser}>{comment.user}</p>
                <div className={styles.commentRating}>
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      className={`${styles.star} ${
                        index < comment.rating ? styles.starFilled : ""
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className={styles.commentContent}>{comment.content}</p>
                <p className={styles.commentDate}>{comment.date}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;