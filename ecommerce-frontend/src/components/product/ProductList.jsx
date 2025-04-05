import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductItem from "./ProductItem";
import styles from "./ProductList.module.css";
import { FaFilter, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { getProducts } from "../../services/api";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const location = useLocation();

  // Lấy danh sách sản phẩm từ API khi component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProducts();
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Lấy danh sách danh mục từ sản phẩm
  const categories = ["Tất cả", ...new Set(products.map((p) => p.categoryId))];

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
      filtered = filtered.filter((p) => p.categoryId === selectedCategory);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset về trang 1 khi lọc
  }, [selectedCategory, products, location.search]);

  // Tính toán sản phẩm hiển thị trên trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

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
          <div
            className={`${styles.filterDropdown} ${
              showFilter ? styles.show : ""
            }`}
          >
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.filterItem} ${
                  selectedCategory === category ? styles.active : ""
                }`}
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
                  className={`${styles.pageButton} ${
                    currentPage === index + 1 ? styles.active : ""
                  }`}
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
