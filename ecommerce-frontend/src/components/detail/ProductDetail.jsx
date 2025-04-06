import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductById, addToCart } from "../../services/api";
import ReviewForm from "../review/ReviewForm";
import styles from "./ProductDetail.module.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const getSliderImages = () => {
    if (!product || !product.images) return [];
    return product.images.map((image) => `${API_URL}/images/${image}`);
  };

  const sliderImages = getSliderImages();

  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? sliderImages.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) =>
      prev === sliderImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleSizeSelect = (size) => setSelectedSize(size);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert("Vui lòng chọn kích thước!");
      return;
    }
    try {
      await addToCart(product.id, quantity);
      alert(
        `Đã thêm ${quantity} sản phẩm ${product.name} (kích thước: ${selectedSize}) vào giỏ hàng!`
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  if (loading) return <div className={styles.loadingWrapper}>Đang tải...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm!</div>;

  const sizes = product.extraAttribute
    ? product.extraAttribute.split(",").map((s) => s.trim())
    : ["S", "M", "L", "XL"];

  return (
    <div className={styles.container}>
      <div className={styles.productWrapper}>
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img src={sliderImages[currentSlide]} alt={product.name} />
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

        <div className={styles.infoSection}>
          <h1 className={styles.productName}>{product.name}</h1>
          <p className={styles.brand}>
            Thương hiệu: <span>ECOMMERCE®</span> | Tình trạng:{" "}
            <span>{product.quantity > 0 ? "Còn hàng" : "Hết hàng"}</span>
          </p>
          <p className={styles.price}>
            {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
          </p>
          <div className={styles.sizeSection}>
            <p>Kích thước</p>
            <div className={styles.sizeOptions}>
              {sizes.map((size) => (
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

      <div className={styles.descriptionSection}>
        <h2 className={styles.descriptionTitle}>Mô tả sản phẩm</h2>
        <div className={styles.descriptionContent}>
          {product.description.split("\n").map((line, index) => (
            <p key={index}>{line.trim()}</p>
          ))}
        </div>
      </div>

      {/* Đánh giá */}
      <ReviewForm productCode={product.productCode} />
    </div>
  );
}

export default ProductDetail;
