import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { getProductById, addToCart } from "../../services/api";
import ReviewForm from "../review/ReviewForm";
import styles from "./ProductDetail.module.css";
import notFound from "../../assets/productnotfound.png";
import { AuthContext } from "../../context/AuthContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate(); // Thêm để điều hướng đến trang đăng nhập
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

  useEffect(() => {
    if (showLoginPopup) {
      const timer = setTimeout(() => {
        setShowLoginPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLoginPopup]);

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
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }
  
    if (!selectedSize) {
      alert("Vui lòng chọn kích thước!");
      return;
    }
  
    const availableQuantity = product.quantity?.[selectedSize] ?? 0;
    if (quantity > availableQuantity) {
      alert(`Chỉ còn ${availableQuantity} sản phẩm cho kích thước ${selectedSize}!`);
      return;
    }
  
    try {
      // Use full product object like ProductItem for consistency
      await addToCart(product, quantity, selectedSize);
      alert(
        `Đã thêm sản phẩm: ${product.name} vào giỏ hàng!`
      );
  
      // Update localStorage
      let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === product.id && item.size === selectedSize
      );
      if (existingItemIndex >= 0) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push({
          id: product.id,
          productName: product.name,
          imageUrl: product.images?.[0]
            ? `${API_URL}/images/${product.images[0]}`
            : null,
          price: product.price,
          quantity,
          size: selectedSize,
        });
      }
  
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error adding to cart:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      alert("Thêm vào giỏ hàng thất bại! Vui lòng thử lại.");
    }
  };

  if (loading) return <div className={styles.loadingWrapper}>Đang tải...</div>;
  if (!product) return <img className={styles.notFound} src={notFound}></img>;

  const sizes =
    product.sizes.length > 0 ? product.sizes : ["Hiện tại chưa update"];
  const totalQuantity = Object.values(product.quantity).reduce(
    (sum, qty) => sum + qty,
    0
  );

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
            <span>{totalQuantity > 0 ? "Còn hàng" : "Hết hàng"}</span>
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
                  disabled={product.quantity[size] === 0} // Vô hiệu hóa nếu hết hàng
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

      {showLoginPopup && (
        <div className={styles.loginPopup}>
          <p>Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!</p>
          <button
            className={styles.loginButton}
            onClick={() => navigate("/login")} // Điều hướng đến trang đăng nhập
          >
            Đăng nhập
          </button>
          <button
            className={styles.closeButton}
            onClick={() => setShowLoginPopup(false)}
          >
            Đóng
          </button>
        </div>
      )}

      <ReviewForm productCode={product.productCode} />
    </div>
  );
}

export default ProductDetail;
