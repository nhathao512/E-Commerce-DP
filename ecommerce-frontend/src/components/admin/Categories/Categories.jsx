import React, { useState } from 'react';
import styles from './Categories.module.css';

function Categories() {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Điện tử', description: 'Sản phẩm công nghệ' },
        { id: 2, name: 'Thời trang', description: 'Quần áo và phụ kiện' },
    ]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });

    // Thêm danh mục
    const addCategory = () => {
        if (newCategory.name.trim() === '') return;
        setCategories([...categories, { id: Date.now(), ...newCategory }]);
        setNewCategory({ name: '', description: '' });
    };

    // Sửa danh mục
    const editCategory = (id) => {
        const categoryToEdit = categories.find(cat => cat.id === id);
        const newName = prompt('Nhập tên mới:', categoryToEdit.name);
        const newDesc = prompt('Nhập mô tả mới:', categoryToEdit.description);
        if (newName) {
            setCategories(categories.map(cat =>
                cat.id === id ? { ...cat, name: newName, description: newDesc || cat.description } : cat
            ));
        }
    };

    // Xóa danh mục
    const deleteCategory = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
            setCategories(categories.filter(cat => cat.id !== id));
        }
    };

    return (
        <div className={styles.container}>
            <h1>Quản lý danh mục</h1>
            
            {/* Form thêm danh mục */}
            <div className={styles.form}>
                <input
                    type="text"
                    placeholder="Tên danh mục"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Mô tả"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
                <button onClick={addCategory}>Thêm danh mục</button>
            </div>

            {/* Bảng danh sách danh mục */}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên danh mục</th>
                        <th>Mô tả</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                                <button
                                    className={styles.editBtn}
                                    onClick={() => editCategory(category.id)}
                                >
                                    Sửa
                                </button>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => deleteCategory(category.id)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Categories;