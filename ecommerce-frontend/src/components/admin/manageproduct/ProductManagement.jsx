import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
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

  // Callback để cập nhật sản phẩm sau khi upload ảnh
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
      <h1>
        <ShoppingBag /> Quản lý sản phẩm
      </h1>
      <div className={styles.controls}>
        <button onClick={handleCreate}>Tạo mới</button>
        <button onClick={() => setSortAsc(!sortAsc)}>
          {sortAsc ? "⬇ DESC" : "⬆ ASC"}
        </button>
        <input
          type="text"
          placeholder="🔍 Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Dashboard
        title="Danh sách sản phẩm"
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
          onSave={async (formData) => {
            try {
              if (editingProduct) {
                const response = await updateProduct(editingProduct.id, formData);
                setProducts(
                  products.map((p) =>
                    p.id === editingProduct.id ? { ...p, ...response.data } : p
                  )
                );
              } else {
                const response = await addProduct(formData);
                setProducts([...products, response.data]);
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

// Giữ nguyên ProductForm như mã gốc
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
    setIsSubmitting(true);
    const form = e.target;
    const formData = new FormData();

    formData.append("name", form.name.value);
    formData.append("description", form.description.value);
    formData.append("price", parseFloat(form.price.value) || 0);
    formData.append("categoryId", form.categoryId.value);
    formData.append("type", type.toLowerCase());

    if (type.toLowerCase() === "clothing") {
      formData.append("material", material);
    } else if (type.toLowerCase() === "shoe") {
      formData.append("sole", sole);
    }
    formData.append("sizes", JSON.stringify(sizes));
    formData.append("quantity", JSON.stringify(quantities));

    try {
      await onSave(formData);
    } catch (error) {
      console.error("Error saving product:", error);
      alert(
        `Failed to save product: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>{editingProduct ? "Sửa sản phẩm" : "Tạo sản phẩm mới"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Tên sản phẩm"
            defaultValue={editingProduct?.name || ""}
            required
          />
          <input
            name="description"
            placeholder="Mô tả"
            defaultValue={editingProduct?.description || ""}
          />
          <input
            name="price"
            placeholder="Giá bán (VD: 100000)"
            type="number"
            defaultValue={editingProduct?.price || ""}
            required
          />
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

          {type === "clothing" && (
            <div>
              <input
                type="text"
                placeholder="Chất liệu"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                required
              />
              {sizes.map((size, index) => (
                <div key={size} className={styles.sizeRow}>
                  <input
                    type="text"
                    placeholder="Size"
                    value={size}
                    onChange={(e) => handleSizeChange(index, e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder={`Số lượng ${size}`}
                    value={quantities[size] !== undefined ? quantities[size] : 0}
                    onChange={(e) => handleQuantityChange(size, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteSize(index)}
                    className={styles.deleteSizeButton}
                    disabled={sizes.length === 1}
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
              >
                + Thêm size
              </button>
            </div>
          )}

          {type === "shoe" && (
            <div>
              <input
                type="text"
                placeholder="Loại đế giày"
                value={sole}
                onChange={(e) => setSole(e.target.value)}
                required
              />
              {sizes.map((size, index) => (
                <div key={size} className={styles.sizeRow}>
                  <input
                    type="text"
                    placeholder="Size"
                    value={size}
                    onChange={(e) => handleSizeChange(index, e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    placeholder={`Số lượng ${size}`}
                    value={quantities[size] !== undefined ? quantities[size] : 0}
                    onChange={(e) => handleQuantityChange(size, e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteSize(index)}
                    className={styles.deleteSizeButton}
                    disabled={sizes.length === 1}
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
              >
                + Thêm size
              </button>
            </div>
          )}

          <div className={styles.popupButtons}>
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