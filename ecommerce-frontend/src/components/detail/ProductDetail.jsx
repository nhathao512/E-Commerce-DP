import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, addToCart, getCart } from "../../services/api";
import ReviewForm from "../review/ReviewForm";
import Popup from "../common/Popup";
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
  const [popup, setPopup] = useState(null);
  const [notification, setNotification] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
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
      console.log("Triggering no-size notification");
      setNotification({
        message: "Vui lòng chọn kích thước!",
        type: "success",
      });
      setTimeout(() => {
        console.log("Clearing no-size notification");
        setNotification(null);
      }, 3000);
      return;
    }

    const availableQuantity = product.quantity?.[selectedSize] ?? 0;
    if (quantity > availableQuantity) {
      setNotification({
        message: `Chỉ còn ${availableQuantity} sản phẩm cho kích thước ${selectedSize}!`,
        type: "Error",
      });
     
      return;
    }

    try {
      const userId = localStorage.getItem("userID");
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }

      const productPayload = {
        id: product.id,
        productCode: product.productCode,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images || [],
        categoryId: product.categoryId,
        sizes: product.sizes || [],
        quantity: product.quantity || {},
        _class:
          product.type === "Clothing"
            ? "com.ecommerce.model.ClothingProduct"
            : "com.ecommerce.model.ShoeProduct",
        material: product.material || null,
        sole: product.sole || null,
      };

      await addToCart(productPayload, quantity, selectedSize, userId);

      // Đồng bộ giỏ hàng từ backend
      const cartResponse = await getCart(userId);
      const cartData = cartResponse.data;
      const mappedCartData = cartData.map((item) => ({
        id: item.product.id,
        productName: item.product.name,
        imageUrl:
          item.product.images && item.product.images.length > 0
            ? `${API_URL}/images/${item.product.images[0]}`
            : null,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
      }));

      localStorage.setItem("cartItems", JSON.stringify(mappedCartData));
      console.log("Triggering success notification");
      setNotification({
        message: `Đã thêm ${product.name} (${selectedSize}) x${quantity} vào giỏ hàng!`,
        type: "success",
      });
      setTimeout(() => {
        console.log("Clearing success notification");
        setNotification(null);
      }, 3000);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setPopup({
          message: (
            <>
              <span className="productName">{product.name}</span> (
              {selectedSize}) đã có trong giỏ hàng!
            </>
          ),
          type: "success",
          onClose: () => setPopup(null),
        });
      } else {
        console.error("Error adding to cart:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setPopup({
          message: "Thêm vào giỏ hàng thất bại! Vui lòng thử lại.",
          type: "success",
          onClose: () => setPopup(null),
        });
      }
    }
  };

  if (loading) return <div className={styles.loadingWrapper}>Đang tải...</div>;
  if (!product)
    return (
      <img className={styles.notFound} src={notFound} alt="Product not found" />
    );

  const sizes =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : ["Hiện tại chưa update"];
  const totalQuantity = product.quantity
    ? Object.values(product.quantity).reduce((sum, qty) => sum + qty, 0)
    : 0;

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
                  disabled={product.quantity && product.quantity[size] === 0}
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
          {product.description &&
            product.description
              .split("\n")
              .map((line, index) => <p key={index}>{line.trim()}</p>)}
        </div>
      </div>

      <ReviewForm productCode={product.productCode} />

      {showLoginPopup && (
        <div className={styles.loginPopup}>
          <p>Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!</p>
          <button
            className={styles.loginButton}
            onClick={() => navigate("/login")}
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

      {popup && <Popup {...popup} />}
      {notification && (
        <div
          className={`${styles.notification} ${styles.notificationSuccess}`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default ProductDetail;