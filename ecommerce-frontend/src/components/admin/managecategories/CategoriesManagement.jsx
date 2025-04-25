import React, { useState, useEffect } from "react";
import Dashboard from "../dashboard/Dashboard";
import styles from "./CategoriesManagement.module.css";
import { FaTags } from "react-icons/fa";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/api";

function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAsc, setIsAsc] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Không thể tải danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories
    .filter(
      (cat) =>
        (cat.name &&
          cat.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cat.icon && cat.icon.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) =>
      isAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
    );

  const handleCreate = () => {
    setEditingCategory(null);
    setIsPopupOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsPopupOpen(true);
  };

  const handleDelete = (id) => {
    const category = categories.find((cat) => cat.id === id);
    setCategoryToDelete(category);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(categoryToDelete.id);
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryToDelete.id)
      );
      setIsDeletePopupOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Không thể xóa danh mục");
      setIsDeletePopupOpen(false);
    }
  };

  const cancelDelete = () => {
    setIsDeletePopupOpen(false);
    setCategoryToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const icon = form.icon.value;

    try {
      if (editingCategory) {
        console.log("Updating category with ID:", editingCategory.id);
        const updatedCategory = await updateCategory(
          editingCategory.id,
          name,
          icon
        );
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id ? updatedCategory.data : cat
          )
        );
      } else {
        const newCategory = await addCategory(name, icon);
        setCategories((prev) => [...prev, newCategory.data]);
      }
      setIsPopupOpen(false);
    } catch (err) {
      console.error("Error saving category:", err);
      setError("Không thể lưu danh mục");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải danh mục...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          <FaTags style={{ marginRight: "0.5rem" }} /> QUẢN LÝ DANH MỤC
        </h1>
      </div>

      <div className={styles.searchBar}>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleCreate}>Tạo mới</button>
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
                <label>Tên danh mục:</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingCategory?.name || ""}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Icon (emoji hoặc class):</label>
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

      {isDeletePopupOpen && (
        <div className={styles.overlay} onClick={cancelDelete}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Xác nhận xóa</h2>
            <p>
              Bạn có chắc chắn muốn xóa danh mục{" "}
              <strong>{categoryToDelete?.name}</strong> không?
            </p>
            <div className={styles.buttonGroup}>
              <button onClick={confirmDelete} className={styles.deleteButton}>
                Xóa
              </button>
              <button onClick={cancelDelete}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesManagement;
