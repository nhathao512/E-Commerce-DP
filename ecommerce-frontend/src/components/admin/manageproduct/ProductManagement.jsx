import React, { useState, useEffect } from "react";
import Dashboard from "../dashboard/Dashboard";
import styles from "./ProductManagement.module.css";
import { ShoppingBag, X } from "lucide-react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
} from "../../../services/api";
import ImageManagement from "./ImageManagement";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const API_URL = "http://localhost:8080/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProducts(),
          getAllCategories(),
        ]);
        const validProducts = productsResponse.data
          .filter(
            (product) =>
              product &&
              product.name &&
              typeof product.name === "string"
          )
          .map((product) => ({
            ...product,
            id: product.id || "N/A",
            productCode: product.productCode || "N/A",
            images: Array.isArray(product.images) ? product.images : [],
          }));
        setProducts(validProducts);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load products or categories");
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    console.log("Product to edit:", product);
    setEditingProduct(product);
    setPopupOpen(true);
  };

  const handleImages = (product) => {
    setSelectedProduct(product);
    setImagePopupOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setPopupOpen(true);
  };

  const handleUpdateImages = (productId, updatedProduct) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, ...updatedProduct } : p
      )
    );
  };

  const filteredData = [...products]
    .filter((product) =>
      product.name && typeof product.name === "string"
        ? product.name.toLowerCase().includes(search.toLowerCase())
        : false
    )
    .sort((a, b) =>
      sortAsc
        ? (a.name || "").localeCompare(b.name || "")
        : (b.name || "").localeCompare(a.name || "")
    )
    .map((product) => ({
      ...product,
      quantityDisplay: product.quantity ? (
        <div>
          {Object.entries(product.quantity).map(([size, qty]) => (
            <div key={size}>{`${size}: ${qty}`}</div>
          ))}
        </div>
      ) : (
        ""
      ),
    }));

  const columns = [
    { key: "id", label: "ID" },
    { key: "productCode", label: "Mã sản phẩm" },
    { key: "name", label: "Tên" },
    { key: "description", label: "Mô tả" },
    { key: "price", label: "Giá" },
    { key: "quantityDisplay", label: "Số lượng" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <ShoppingBag style={{ marginRight: "0.5rem" }} /> QUẢN LÝ SẢN PHẨM
        </h1>
      </div>

      <div className={styles.searchBar}>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleCreate}>Tạo mới</button>
          <button onClick={() => setSortAsc(!sortAsc)}>
            {sortAsc ? "⬇ DESC" : "⬆ ASC"}
          </button>
        </div>
      </div>

      <Dashboard
        columns={columns}
        data={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onImages={handleImages}
      />

      {popupOpen && (
        <ProductForm
          editingProduct={editingProduct}
          categories={categories}
          onSave={async (formData, formValues) => {
            try {
              let updatedProduct;
              if (editingProduct) {
                const response = await updateProduct(editingProduct.id, formData);
                updatedProduct = {
                  ...editingProduct,
                  ...response.data,
                  id: response.data.id || editingProduct.id,
                  productCode: response.data.productCode || editingProduct.productCode || "N/A",
                  name: response.data.name || formValues.name,
                  description: response.data.description || formValues.description,
                  price: response.data.price || formValues.price,
                  categoryId: response.data.categoryId || formValues.categoryId,
                  type: response.data.type || formValues.type,
                  images: Array.isArray(response.data.images)
                    ? response.data.images
                    : editingProduct.images,
                  quantity: response.data.quantity || formValues.quantity,
                  sizes: response.data.sizes || formValues.sizes,
                  material: response.data.material || formValues.material,
                  sole: response.data.sole || formValues.sole,
                };
                setProducts(
                  products.map((p) =>
                    p.id === editingProduct.id ? updatedProduct : p
                  )
                );
              } else {
                console.log("Sending formData to addProduct:", [...formData.entries()]);
                const response = await addProduct(formData);
                console.log("API response:", response.data);
                updatedProduct = {
                  ...response.data,
                  id: response.data.id || `temp-${Date.now()}`,
                  productCode: response.data.productCode || `CODE-${Date.now()}`,
                  images: Array.isArray(response.data.images)
                    ? response.data.images
                    : [],
                  name: response.data.name || formValues.name,
                  description: response.data.description || formValues.description,
                  price: response.data.price || formValues.price,
                  categoryId: response.data.categoryId || formValues.categoryId,
                  type: response.data.type || formValues.type,
                  quantity: response.data.quantity || formValues.quantity,
                  sizes: response.data.sizes || formValues.sizes,
                  material: response.data.material || formValues.material,
                  sole: response.data.sole || formValues.sole,
                };
                console.log("New product added:", updatedProduct);
                // Reload the page to fetch updated product list
                window.location.reload();
              }
              setPopupOpen(false);
            } catch (error) {
              console.error("Error saving product:", error);
              alert(
                `Failed to save product: ${
                  error.response?.data?.message || error.message
                }`
              );
            }
          }}
          onCancel={() => setPopupOpen(false)}
        />
      )}

      {imagePopupOpen && (
        <ImageManagement
          product={selectedProduct}
          onClose={() => setImagePopupOpen(false)}
          apiUrl={API_URL}
          onUpdateImages={handleUpdateImages}
        />
      )}
    </div>
  );
}

function ProductForm({ editingProduct, categories, onSave, onCancel }) {
  const [type, setType] = useState(editingProduct?.type?.toLowerCase() || "clothing");
  const [sizes, setSizes] = useState(editingProduct?.sizes || []);
  const [quantities, setQuantities] = useState(() => {
    if (editingProduct?.quantity) {
      if (typeof editingProduct.quantity === "string") {
        try {
          return editingProduct.quantity.split(", ").reduce((acc, item) => {
            const [size, qty] = item.split(": ");
            acc[size] = parseInt(qty) || 0;
            return acc;
          }, {});
        } catch (error) {
          console.error("Error parsing quantity string:", error);
          return {};
        }
      }
      return editingProduct.quantity;
    }
    return {};
  });
  const [sole, setSole] = useState(editingProduct?.sole || "");
  const [material, setMaterial] = useState(editingProduct?.material || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("editingProduct:", editingProduct);
    console.log("sizes:", sizes);
    console.log("quantities:", quantities);
  }, [editingProduct, sizes, quantities]);

  const handleAddSize = () => {
    const newSize = `Size ${sizes.length + 1}`;
    setSizes([...sizes, newSize]);
    setQuantities({ ...quantities, [newSize]: 0 });
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...sizes];
    const oldSize = newSizes[index];
    newSizes[index] = value;
    setSizes(newSizes);

    const newQuantities = { ...quantities };
    if (oldSize !== value) {
      newQuantities[value] = newQuantities[oldSize] || 0;
      delete newQuantities[oldSize];
    }
    setQuantities(newQuantities);
  };

  const handleQuantityChange = (size, value) => {
    setQuantities({ ...quantities, [size]: parseInt(value) || 0 });
  };

  const handleDeleteSize = (index) => {
    const sizeToDelete = sizes[index];
    const newSizes = sizes.filter((_, i) => i !== index);
    const newQuantities = { ...quantities };
    delete newQuantities[sizeToDelete];
    setSizes(newSizes);
    setQuantities(newQuantities);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);
    const form = e.target;
    const formData = new FormData();

    const formValues = {
      name: form.name.value,
      description: form.description.value,
      price: parseFloat(form.price.value) || 0,
      categoryId: form.categoryId.value,
      type: type.toLowerCase(),
      sizes: sizes,
      quantity: quantities,
      material: type.toLowerCase() === "clothing" ? material : undefined,
      sole: type.toLowerCase() === "shoe" ? sole : undefined,
    };

    formData.append("name", formValues.name);
    formData.append("description", formValues.description);
    formData.append("price", formValues.price);
    formData.append("categoryId", formValues.categoryId);
    formData.append("type", formValues.type);

    if (type.toLowerCase() === "clothing") {
      formData.append("material", material);
    } else if (type.toLowerCase() === "shoe") {
      formData.append("sole", sole);
    }
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("quantity", JSON.stringify(quantities));

    console.log("Form values before save:", formValues);
    console.log("FormData before save:", [...formData.entries()]);

    try {
      await onSave(formData, formValues);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{editingProduct ? "Sửa sản phẩm" : "Tạo sản phẩm mới"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Tên sản phẩm:</label>
            <input
              name="name"
              defaultValue={editingProduct?.name || ""}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Mô tả:</label>
            <input
              name="description"
              defaultValue={editingProduct?.description || ""}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Giá bán:</label>
            <input
              name="price"
              type="number"
              defaultValue={editingProduct?.price || ""}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Loại sản phẩm:</label>
            <select
              value={type}
              onChange={(e) => {
                const newType = e.target.value;
                setType(newType);
                setSizes([]);
                setQuantities({});
              }}
            >
              <option value="clothing">Clothing</option>
              <option value="shoe">Shoe</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Danh mục:</label>
            <select
              name="categoryId"
              defaultValue={editingProduct?.categoryId || ""}
              required
            >
              <option value="" disabled>
                Chọn danh mục
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {type === "clothing" && (
            <>
              <div className={styles.formGroup}>
                <label>Chất liệu:</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  required
                />
              </div>
              {sizes.map((size, index) => (
                <div key={size} className={styles.sizeRow}>
                  <div className={styles.formGroup}>
                    <label>Size:</label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Số lượng:</label>
                    <input
                      type="number"
                      value={quantities[size] !== undefined ? quantities[size] : 0}
                      onChange={(e) => handleQuantityChange(size, e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSize(index)}
                    className={styles.deleteSizeButton}
                    disabled={sizes.length === 1 || isSubmitting}
                    title="Xóa size"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSize}
                className={styles.addSizeButton}
                disabled={isSubmitting}
              >
                Thêm size
              </button>
            </>
          )}

          {type === "shoe" && (
            <>
              <div className={styles.formGroup}>
                <label>Loại đế giày:</label>
                <input
                  type="text"
                  value={sole}
                  onChange={(e) => setSole(e.target.value)}
                  required
                />
              </div>
              {sizes.map((size, index) => (
                <div key={size} className={styles.sizeRow}>
                  <div className={styles.formGroup}>
                    <label>Size:</label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Số lượng:</label>
                    <input
                      type="number"
                      value={quantities[size] !== undefined ? quantities[size] : 0}
                      onChange={(e) => handleQuantityChange(size, e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSize(index)}
                    className={styles.deleteSizeButton}
                    disabled={sizes.length === 1 || isSubmitting}
                    title="Xóa size"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSize}
                className={styles.addSizeButton}
                disabled={isSubmitting}
              >
                Thêm size
              </button>
            </>
          )}

          <div className={styles.buttonGroup}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </button>
            <button type="button" onClick={onCancel} disabled={isSubmitting}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductManagement;