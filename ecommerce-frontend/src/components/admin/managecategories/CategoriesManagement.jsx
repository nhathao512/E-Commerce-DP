import React, { useState } from "react";
import Dashboard from "../dashboard/Dashboard";
import styles from "./CategoriesManagement.module.css";
import { FaTags } from "react-icons/fa";

function CategoriesManagement() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Electronics", icon: "🔌" },
    { id: 2, name: "Books", icon: "📚" },
    { id: 3, name: "Fashion", icon: "👗" },
    { id: 4, name: "Sports", icon: "🏀" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAsc, setIsAsc] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const filteredCategories = categories
    .filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.icon.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      isAsc ? a.id - b.id : b.id - a.id
    )

  const handleCreate = () => {
    setEditingCategory(null);
    setIsPopupOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsPopupOpen(true);
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const id = editingCategory
      ? editingCategory.id
      : categories.length === 0
        ? 1
        : Math.max(...categories.map((c) => c.id)) + 1;

    const newCategory = {
      id,
      name: form.name.value,
      icon: form.icon.value,
    };

    setCategories((prev) => {
      if (editingCategory) {
        return prev.map((cat) => (cat.id === id ? newCategory : cat));
      }
      return [...prev, newCategory];
    });

    setIsPopupOpen(false);
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.header}>
        <h1>
          <FaTags/> Quản lý danh mục
        </h1>

        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleCreate}>➕ Tạo mới</button>
          <button onClick={() => setIsAsc(!isAsc)}>
            {isAsc ? "⬇ DESC" : "⬆ ASC"}
          </button>
        </div>
      </div>

      <Dashboard
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Tên" },
          { key: "icon", label: "Icon" },
        ]}
        data={filteredCategories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isPopupOpen && (
        <div className={styles.overlay} onClick={() => setIsPopupOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>{editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCategory?.name || ""}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Icon (emoji or class):</label>
                <input
                  type="text"
                  name="icon"
                  defaultValue={editingCategory?.icon || ""}
                  required
                />
              </div>
              <div className={styles.buttonGroup}>
                <button type="submit">Lưu</button>
                <button type="button" onClick={() => setIsPopupOpen(false)}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesManagement;
