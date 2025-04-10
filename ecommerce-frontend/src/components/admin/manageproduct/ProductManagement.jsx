import React, { useState } from "react";
import Dashboard from "../../common/Dashboard";
import styles from "./ProductManagement.module.css";
import { ShoppingBag } from "lucide-react";

function ProductManagement() {
  const [products, setProducts] = useState([
    {
      id: 1,
      productCode: "P001",
      name: "Product A",
      description: "Description A",
      price: 100,
      images: "https://via.placeholder.com/50",
      categoryId: "C001",
      quantity: 10,
    },
    {
      id: 2,
      productCode: "P002",
      name: "Product B",
      description: "Description B",
      price: 200,
      images: "https://via.placeholder.com/50",
      categoryId: "C002",
      quantity: 5,
    },
  ]);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setPopupOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setPopupOpen(true);
  }

  const handleSave = (newProduct) => {
    if (editingProduct) {
      // Edit existing
      setProducts(products.map((p) => (p.id === newProduct.id ? newProduct : p)));
    } else {
      // Create new
      setProducts([...products, { ...newProduct, id: Date.now() }]);
    }
    setPopupOpen(false);
  };

  const filteredData = [...products]
    .filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortAsc
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  const columns = [
    { key: "id", label: "ID" },
    { key: "productCode", label: "Mã sản phẩm" },
    { key: "name", label: "Name" },
    { key: "description", label: "Mô tả" },
    { key: "price", label: "Giá" },
    { key: "images", label: "Ảnh" },
    { key: "categoryId", label: "Mã danh mục" },
    { key: "quantity", label: "Số lượng" },
  ];

  return (
    <div className={styles.container}>
      <h1><ShoppingBag /> Quản lý sản phẩm</h1>
      <div className={styles.controls}>
        <button onClick={handleCreate}>➕ Tạo mới</button>
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
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>{editingProduct ? "Sửa sản phẩm" : "Tạo sản phẩm mới"}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const newProduct = {
                  id: editingProduct?.id || null,
                  productCode: form.productCode.value,
                  name: form.name.value,
                  description: form.description.value,
                  price: parseFloat(form.price.value),
                  images: form.images.value,
                  categoryId: form.categoryId.value,
                  quantity: parseInt(form.quantity.value),
                };
                handleSave(newProduct);
              }}
            >
              <input name="productCode" placeholder="Mả sản phẩm" defaultValue={editingProduct?.productCode || ""} />
              <input name="name" placeholder="Tên sản phẩm" defaultValue={editingProduct?.name || ""} />
              <input name="description" placeholder="Mô tả" defaultValue={editingProduct?.description || ""} />
              <input name="price" placeholder="Giá" type="number" defaultValue={editingProduct?.price || 0} />
              <input name="images" placeholder="URL ảnh" defaultValue={editingProduct?.images || ""} />
              <input name="categoryId" placeholder="Mã danh mục" defaultValue={editingProduct?.categoryId || ""} />
              <input name="quantity" placeholder="Số lượng" type="number" defaultValue={editingProduct?.quantity || 0} />
              <div className={styles.popupButtons}>
                <button type="submit">💾 Save</button>
                <button type="button" onClick={() => setPopupOpen(false)}>❌ Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
