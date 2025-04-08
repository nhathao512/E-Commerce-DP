import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import { getProducts, getAllCategories } from "../../services/api";
import slider1 from "../../assets/slider1.jpg";
import slider2 from "../../assets/slider2.jpg";
import slider3 from "../../assets/slider3.jpg";
import notFound from "../../assets/productnotfound.png";

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null); // Lưu category.id
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 4;
  const navigate = useNavigate();
  const API_URL = "http://localhost:8080/api";

  const sliderImages = [slider1, slider2, slider3];

  // Fetch danh sách sản phẩm và categories từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await getProducts();
        setProducts(productResponse.data);

        const categoryResponse = await getAllCategories();
        setCategories(categoryResponse.data);
        console.log(categoryResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lọc sản phẩm dựa trên category.id
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.categoryId === selectedCategory)
    : products;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1));
  };

  const handleProductDetail = (product) => {
    navigate(`/product/${product.id}`);
  };

  useEffect(() => {
    const autoSlide = setInterval(() => {
      handleNextSlide();
    }, 5000);
    return () => clearInterval(autoSlide);
  }, [currentSlide]);

  if (loading) {
    return <div className={styles.loadingWrapper}>Đang tải...</div>;
  }

  return (
    <div className={styles.homeContainer}>
      <div className={styles.topSpacing}></div>

      <div className={styles.imageSlider}>
        <button className={styles.sliderArrow} onClick={handlePrevSlide}>
          ❮
        </button>
        <div
          className={styles.sliderWrapper}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {sliderImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index + 1}`}
              className={styles.sliderImage}
            />
          ))}
        </div>
        <button className={styles.sliderArrow} onClick={handleNextSlide}>
          ❯
        </button>
      </div>

      <div className={styles.categoriesBar}>
        {categories.map((category) => (
          <div
            key={category.id}
            className={`${styles.categoryItem} ${
              selectedCategory === category.id ? styles.activeCategory : ""
            }`}
            onClick={() => {
              setSelectedCategory(
                category.id === selectedCategory ? null : category.id
              );
              setCurrentPage(1);
            }}
          >
            <span className={styles.categoryIcon}>{category.icon}</span>
            <span>{category.name}</span>
          </div>
        ))}
      </div>

      <div className={styles.featuredProducts}>
        <div className={styles.productsContainer}>
          {filteredProducts.length === 0 ? (
            <img className={styles.notFound} src={notFound}></img>
          ) : (
            <>
              <h2 className={styles.sectionTitle}>SẢN PHẨM NỔI BẬT</h2>
              <div className={styles.productsGrid}>
                {currentProducts.map((product) => (
                  <div
                    key={product.id}
                    className={styles.productItem}
                    onClick={() => handleProductDetail(product)}
                  >
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? `${API_URL}/images/${product.images[0]}`
                          : "https://placehold.co/600x400"
                      }
                      alt={product.name}
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>{product.name}</span>
                      <span className={styles.views}>
                        {product.price.toLocaleString("vi-VN")} VNĐ
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.pagination}>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={styles.paginationButton}
                >
                  Trước
                </button>
                <span>
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={styles.paginationButton}
                >
                  Sau
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;