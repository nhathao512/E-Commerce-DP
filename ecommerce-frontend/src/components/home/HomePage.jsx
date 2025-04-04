import React, { useState, useEffect } from "react";
import styles from "./HomePage.module.css";

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const productsPerPage = 4;

  const categories = [
    { name: "Điện tử", icon: "📱" },
    { name: "Thời trang", icon: "👕" },
    { name: "Gia dụng", icon: "🏠" },
    { name: "Sách", icon: "📚" }
  ];

  const allProducts = [
    { id: 1, name: "iPhone 14", views: 1200, image: "https://placehold.co/600x400", category: "Điện tử" },
    { id: 2, name: "Áo thun Unisex", views: 950, image: "https://placehold.co/600x400", category: "Thời trang" },
    { id: 3, name: "Máy xay sinh tố", views: 870, image: "https://placehold.co/600x400", category: "Gia dụng" },
    { id: 4, name: "Sách Harry Potter", views: 780, image: "https://placehold.co/600x400", category: "Sách" },
    { id: 5, name: "Tai nghe Bluetooth", views: 650, image: "https://placehold.co/600x400", category: "Điện tử" },
    { id: 6, name: "Quần jeans", views: 620, image: "https://placehold.co/600x400", category: "Thời trang" }
  ];

  const sliderImages = [
    "https://placehold.co/600x400/FF6B6B/FFFFFF?text=Slide+1",
    "https://placehold.co/600x400/4ECDC4/FFFFFF?text=Slide+2",
    "https://placehold.co/600x400/45B7D1/FFFFFF?text=Slide+3"
  ];

  const filteredProducts = selectedCategory 
    ? allProducts.filter(product => product.category === selectedCategory)
    : allProducts;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? sliderImages.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev === sliderImages.length - 1 ? 0 : prev + 1));
  };

  // Tự động chuyển slide sau 5 giây
  useEffect(() => {
    const autoSlide = setInterval(() => {
      handleNextSlide();
    }, 5000); // 5000ms = 5 giây

    // Dọn dẹp interval khi component unmount hoặc khi người dùng tương tác
    return () => clearInterval(autoSlide);
  }, [currentSlide]); // Chạy lại khi currentSlide thay đổi để reset timer

  return (
    <div className={styles.homeContainer}>
      <div className={styles.topSpacing}></div>

      <div className={styles.imageSlider}>
        <button className={styles.sliderArrow} onClick={handlePrevSlide}>❮</button>
        <div className={styles.sliderWrapper} style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {sliderImages.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt={`Slide ${index + 1}`} 
              className={styles.sliderImage}
            />
          ))}
        </div>
        <button className={styles.sliderArrow} onClick={handleNextSlide}>❯</button>
      </div>

      <div className={styles.categoriesBar}>
        {categories.map((category, index) => (
          <div 
            key={index} 
            className={`${styles.categoryItem} ${selectedCategory === category.name ? styles.activeCategory : ''}`}
            onClick={() => {
              setSelectedCategory(category.name === selectedCategory ? null : category.name);
              setCurrentPage(1);
            }}
          >
            <span className={styles.categoryIcon}>{category.icon}</span>
            <span>{category.name}</span>
          </div>
        ))}
      </div>

      <div className={styles.featuredProducts}>
        <h2 className={styles.sectionTitle}>Sản phẩm nổi bật</h2>
        <div className={styles.productsContainer}>
          <div className={styles.productsGrid}>
            {currentProducts.map(product => (
              <div key={product.id} className={styles.productItem}>
                <img src={product.image} alt={product.name} className={styles.productImage} />
                <div className={styles.productInfo}>
                  <span className={styles.productName}>{product.name}</span>
                  <span className={styles.views}> ({product.views} lượt xem)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.pagination}>
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            Trước
          </button>
          <span>Trang {currentPage} / {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;