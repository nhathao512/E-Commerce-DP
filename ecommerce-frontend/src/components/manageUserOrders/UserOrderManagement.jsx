import React, { useState } from 'react';
import styles from './UserOrderManagement.module.css';

const mockOrders = [
  { id: 1, image: 'https://via.placeholder.com/80', name: 'Sản phẩm A', quantity: 2, total: 500000, status: 'Hoàn thành' },
  { id: 2, image: 'https://via.placeholder.com/80', name: 'Sản phẩm B', quantity: 1, total: 300000, status: 'Đã hủy' },
  { id: 3, image: 'https://via.placeholder.com/80', name: 'Sản phẩm C', quantity: 3, total: 750000, status: 'Đang giao' },
  { id: 4, image: 'https://via.placeholder.com/80', name: 'Sản phẩm D', quantity: 1, total: 420000, status: 'Hoàn thành' },
];

const UserOrderManagement = () => {
  const [selectedFilterType, setSelectedFilterType] = useState('Trạng thái');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [sortQuantity, setSortQuantity] = useState('ASC');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleReview = (orderId) => {
    alert(`Đánh giá đơn hàng ID: ${orderId}`);
  };

  const handleRepurchase = (orderId) => {
    alert(`Mua lại đơn hàng ID: ${orderId}`);
  };

  let filteredOrders = mockOrders.filter((order) =>
    order.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  if (selectedFilterType === 'Trạng thái') {
    if (selectedStatus !== 'Tất cả') {
      filteredOrders = filteredOrders.filter((order) => order.status === selectedStatus);
    }
  } else if (selectedFilterType === 'Số lượng') {
    filteredOrders.sort((a, b) =>
      sortQuantity === 'ASC' ? a.quantity - b.quantity : b.quantity - a.quantity
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quản lý đơn hàng</h2>

      <div className={styles.filterContainer}>
        <label>Lọc theo:</label>
        <select
          value={selectedFilterType}
          onChange={(e) => setSelectedFilterType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="Trạng thái">Trạng thái</option>
          <option value="Số lượng">Số lượng</option>
        </select>

        {selectedFilterType === 'Trạng thái' && (
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        )}

        {selectedFilterType === 'Số lượng' && (
          <select
            value={sortQuantity}
            onChange={(e) => setSortQuantity(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="ASC">Tăng dần</option>
            <option value="DESC">Giảm dần</option>
          </select>
        )}

        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <table className={styles.orderTable}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>
                  <img src={order.image} alt={order.name} className={styles.productImage} />
                </td>
                <td>{order.name}</td>
                <td>{order.quantity}</td>
                <td>{order.total.toLocaleString()}₫</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => handleReview(order.id)} className={styles.actionBtn}>
                    Đánh giá
                  </button>
                  <button
                    onClick={() => handleRepurchase(order.id)}
                    disabled={order.status === 'Đã hủy'}
                    className={`${styles.actionBtn} ${order.status === 'Đã hủy' ? styles.disabledBtn : ''}`}
                  >
                    Mua lại
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">Không có đơn hàng phù hợp.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserOrderManagement;
