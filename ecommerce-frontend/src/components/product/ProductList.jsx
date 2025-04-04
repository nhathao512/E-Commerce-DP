import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Thêm useLocation để đọc query từ URL
import ProductItem from "./ProductItem";
import styles from "./ProductList.module.css";
import { FaFilter, FaAngleLeft, FaAngleRight } from "react-icons/fa";

const fakeProducts = [
  { id: 1, name: "Áo thun Basic", price: 19.99, description: "Áo thun cotton thoải mái", image: "https://placehold.co/600x400", category: "Áo" },
  { id: 2, name: "Quần Jeans Slim", price: 49.99, description: "Quần jeans thời trang", image: "https://placehold.co/600x400", category: "Quần" },
  { id: 3, name: "Giày Sneaker Trắng", price: 79.99, description: "Giày thể thao phong cách", image: "https://placehold.co/600x400", category: "Giày" },
  { id: 4, name: "Túi Xách Da", price: 99.99, description: "Túi xách da cao cấp", image: "https://placehold.co/600x400", category: "Phụ kiện" },
  { id: 5, name: "Áo Khoác Hoodie", price: 39.99, description: "Áo khoác ấm áp", image: "https://placehold.co/600x400", category: "Áo" },
  { id: 6, name: "Quần Short Thể Thao", price: 29.99, description: "Quần short thoải mái", image: "https://placehold.co/600x400", category: "Quần" }
];

function ProductList() {
  const [products] = useState(fakeProducts);
  const [filteredProducts, setFilteredProducts] = useState(fakeProducts);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const location = useLocation(); // Lấy thông tin URL

  const categories = ["Tất cả", ...new Set(fakeProducts.map(p => p.category))];

  // Giả lập loading khi component mount
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  // Lọc sản phẩm dựa trên danh mục và từ khóa tìm kiếm
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";

    let filtered = products;

    // Lọc theo từ khóa tìm kiếm
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.description.toLowerCase().includes(searchQuery)
      );
    }

    // Lọc theo danh mục
    if (selectedCategory !== "Tất cả") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  }, [selectedCategory, products, location.search]); // Thêm location.search vào dependency

  // Tính toán sản phẩm hiển thị trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowFilter(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Danh sách sản phẩm</h2>
        <div className={styles.filterWrapper}>
          <button className={styles.filterButton} onClick={toggleFilter}>
            <FaFilter /> Bộ lọc
          </button>
          <div className={`${styles.filterDropdown} ${showFilter ? styles.show : ''}`}>
            {categories.map(category => (
              <button
                key={category}
                className={`${styles.filterItem} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className={styles.loading}>Đang tải sản phẩm...</div>
      ) : filteredProducts.length === 0 ? (
        <div className={styles.noResults}>Không tìm thấy sản phẩm nào.</div>
      ) : (
        <>
          <div className={styles.productGrid}>
            {currentProducts.map((product) => (
              <ProductItem key={product.id} product={product} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaAngleLeft />
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <FaAngleRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductList;