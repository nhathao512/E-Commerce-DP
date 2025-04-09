import React, { useState } from 'react';
import styles from './Products.module.css';

function Products() {
    const [products, setProducts] = useState([]);

    const addProduct = () => {
        // Logic thêm sản phẩm
    };

    const editProduct = (id) => {
        // Logic sửa sản phẩm
    };

    const deleteProduct = (id) => {
        // Logic xóa sản phẩm
    };

    return (
        <div className={styles.container}>
            <h1>Quản lý sản phẩm</h1>
            <button onClick={addProduct}>Thêm sản phẩm</button>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Giá</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Render danh sách sản phẩm */}
                </tbody>
            </table>
        </div>
    );
}

export default Products;