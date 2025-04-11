import React, { useState, useEffect } from "react";
import Dashboard from "../Dashboard/Dashboard";
import styles from "./ProductManagement.module.css";
import { ShoppingBag } from "lucide-react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
} from "../../../services/api";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const API_URL = "http://localhost:8080/api";

  // Lấy danh sách sản phẩm và danh mục
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProducts(),
          getAllCategories(),
        ]);
        // Lọc bỏ các sản phẩm không hợp lệ
        const validProducts = productsResponse.data.filter(
          (product) =>
            product && product.name && typeof product.name === "string"
        );
        setProducts(validProducts);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
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
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setPopupOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setPopupOpen(true);
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
      quantity: product.quantity
        ? Object.entries(product.quantity)
            .map(([size, qty]) => `${size}: ${qty}`)
            .join(", ")
        : "",
      images: Array.isArray(product.images)
        ? product.images.map((img) => `${API_URL}/images/${img}`)
        : product.images || [],
    }));

  const columns = [
    { key: "id", label: "ID" },
    { key: "productCode", label: "Mã sản phẩm" },
    { key: "name", label: "Tên" },
    { key: "description", label: "Mô tả" },
    { key: "price", label: "Giá" },
    { key: "images", label: "Ảnh" },
    // { key: "categoryId", label: "Mã danh mục" },
    { key: "quantity", label: "Số lượng" },
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
      />

      {popupOpen && (
        <ProductForm
          editingProduct={editingProduct}
          categories={categories}
          onSave={async (newProduct) => {
            try {
              if (editingProduct) {
                const response = await updateProduct(newProduct.id, newProduct);
                setProducts(
                  products.map((p) =>
                    p.id === newProduct.id ? response.data : p
                  )
                );
              } else {
                const response = await addProduct(newProduct);
                setProducts([...products, response.data]);
              }
              setPopupOpen(false);
            } catch (error) {
              console.error("Error saving product:", error);
            }
          }}
          onCancel={() => setPopupOpen(false)}
        />
      )}
    </div>
  );
}

function ProductForm({ editingProduct, categories, onSave, onCancel }) {
  const [type, setType] = useState(editingProduct?.type || "Clothing");
  const [sizes, setSizes] = useState(
    editingProduct?.sizes || (type === "Clothing" ? ["S", "M", "L", "XL"] : [])
  );
  const [quantities, setQuantities] = useState(
    editingProduct?.quantity || { S: 0, M: 0, L: 0, XL: 0 }
  );
  const [sole, setSole] = useState(editingProduct?.sole || "");
  const [material, setMaterial] = useState(editingProduct?.material || "");
  const [files, setFiles] = useState([]);

  const handleAddSize = () => {
    setSizes([...sizes, `Size ${sizes.length + 1}`]);
    setQuantities({ ...quantities, [`Size ${sizes.length + 1}`]: 0 });
  };

  const handleSizeChange = (index, value) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);

    const newQuantities = { ...quantities };
    const oldSize = sizes[index];
    newQuantities[value] = newQuantities[oldSize] || 0;
    delete newQuantities[oldSize];
    setQuantities(newQuantities);
  };

  const handleQuantityChange = (size, value) => {
    setQuantities({ ...quantities, [size]: parseInt(value) || 0 });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) =>
      ["image/png", "image/jpeg", "image/jpg"].includes(file.type)
    );
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    files.forEach((file) => formData.append("image", file));
    formData.append("name", form.name.value);
    formData.append("description", form.description.value);
    formData.append("price", parseFloat(form.price.value));
    formData.append("categoryId", form.categoryId.value);
    formData.append("type", type);

    if (type === "Clothing") {
      formData.append("material", material);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("quantity", JSON.stringify(quantities));
    } else {
      formData.append("sole", sole);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("quantity", JSON.stringify(quantities));
    }

    onSave(formData);
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
          <input
            type="file"
            name="images"
            multiple
            accept=".png,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          <select
            value={type}
            onChange={(e) => {
              const newType = e.target.value;
              setType(newType);
              if (newType === "Clothing") {
                setSizes(["S", "M", "L", "XL"]);
                setQuantities({ S: 0, M: 0, L: 0, XL: 0 });
              } else {
                setSizes([]);
                setQuantities({});
              }
            }}
          >
            <option value="Clothing">Clothing</option>
            <option value="Shoe">Shoe</option>
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

          {type === "Clothing" && (
            <div>
              <input
                type="text"
                placeholder="Chất liệu"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                required
              />
              {sizes.map((size, index) => (
                <div key={size} style={{ display: "flex", gap: "10px" }}>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => handleSizeChange(index, e.target.value)}
                    readOnly
                  />
                  <input
                    type="number"
                    placeholder={`Số lượng ${size}`}
                    value={quantities[size] || 0}
                    onChange={(e) => handleQuantityChange(size, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          )}

          {type === "Shoe" && (
            <div>
              <input
                type="text"
                placeholder="Loại đế giày"
                value={sole}
                onChange={(e) => setSole(e.target.value)}
                required
              />
              {sizes.map((size, index) => (
                <div key={size} style={{ display: "flex", gap: "10px" }}>
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
                    value={quantities[size] || 0}
                    onChange={(e) => handleQuantityChange(size, e.target.value)}
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSize}
                style={{ marginTop: "10px" }}
              >
                + Thêm size
              </button>
            </div>
          )}

          <div className={styles.popupButtons}>
            <button type="submit">Lưu</button>
            <button type="button" onClick={onCancel}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductManagement;
