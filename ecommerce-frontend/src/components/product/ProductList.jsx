import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductItem from "./ProductItem";
import styles from "./ProductList.module.css";
import { getProducts, getAllCategories } from "../../services/api";
import notFound from "../../assets/productnotfound.png";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const productResponse = await getProducts();
        setProducts(productResponse.data || []);
        setFilteredProducts(productResponse.data || []);

        const categoryResponse = await getAllCategories();
        console.log("Category Response:", categoryResponse.data);
        const categoryData = categoryResponse.data || [];
        setCategories([{ id: "Tất cả", name: "Tất cả" }, ...categoryData]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
        setFilteredProducts([]);
        setCategories([{ id: "Tất cả", name: "Tất cả" }]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";

    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.description.toLowerCase().includes(searchQuery)
      );
    }

    if (selectedCategory !== "Tất cả") {
      filtered = filtered.filter((p) => p.categoryId === selectedCategory);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [selectedCategory, products, location.search]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowFilter(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Danh sách sản phẩm</h2>
        <div className={styles.filterWrapper}>
          <button className={styles.filterButton} onClick={toggleFilter}>
            <span>☰</span> Bộ lọc
          </button>
          <div
            className={`${styles.filterDropdown} ${
              showFilter ? styles.show : ""
            }`}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                className={`${styles.filterItem} ${
                  selectedCategory === category.id ? styles.active : ""
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className={styles.loading}>Đang tải sản phẩm...</div>
      ) : filteredProducts.length === 0 ? (
        <img
          className={styles.notFound}
          src={notFound}
          alt="Không tìm thấy sản phẩm"
        />
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
                Trước
              </button>
              <span>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                className={styles.pageButton}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductList;
