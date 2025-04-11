import React, { useState } from 'react';
import styles from './UserOrderManagement.module.css';
import { MdOutlineAssignment } from "react-icons/md"
const mockOrders = [
  {
    id: 1,
    products: [
      { name: 'Balo', quantity: 1 },
      { name: 'Giày', quantity: 2 }
    ],
    status: 'Hoàn thành'
  },
  {
    id: 2,
    products: [
      { name: 'Áo thun', quantity: 2 }
    ],
    status: 'Đã hủy'
  },
  {
    id: 3,
    products: [
      { name: 'Laptop', quantity: 1 },
      { name: 'Chuột', quantity: 1 },
      { name: 'Bàn phím', quantity: 1 }
    ],
    status: 'Đang giao'
  }
];

const UserOrderManagement = () => {
  const [selectedFilterType, setSelectedFilterType] = useState('Trạng thái');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [sortQuantity, setSortQuantity] = useState('ASC');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  let filteredOrders = mockOrders.filter((order) =>
    order.products.some(p =>
      p.name.toLowerCase().includes(searchKeyword.toLowerCase())
    )
  );

  if (selectedFilterType === 'Trạng thái') {
    if (selectedStatus !== 'Tất cả') {
      filteredOrders = filteredOrders.filter((order) => order.status === selectedStatus);
    }
  } else if (selectedFilterType === 'Số lượng') {
    filteredOrders.sort((a, b) => {
      const totalA = a.products.reduce((sum, p) => sum + p.quantity, 0);
      const totalB = b.products.reduce((sum, p) => sum + p.quantity, 0);
      return sortQuantity === 'ASC' ? totalA - totalB : totalB - totalA;
    });
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hoàn thành': return styles.statusGreen;
      case 'Đang giao': return styles.statusYellow;
      case 'Đã hủy': return styles.statusRed;
      default: return '';
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <MdOutlineAssignment style={{ marginRight: "8px", verticalAlign: "middle" }} />
        Quản lý đơn hàng
      </h2>

      <div className={styles.filterContainer}>
        <label className={styles.filterLabel}>Lọc theo:</label>
        <select value={selectedFilterType} onChange={(e) => setSelectedFilterType(e.target.value)} className={styles.filterSelect}>
          <option value="Trạng thái">Trạng thái</option>
          <option value="Số lượng">Số lượng</option>
        </select>

        {selectedFilterType === 'Trạng thái' && (
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={styles.filterSelect}>
            <option value="Tất cả">Tất cả</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        )}

        {selectedFilterType === 'Số lượng' && (
          <select value={sortQuantity} onChange={(e) => setSortQuantity(e.target.value)} className={styles.filterSelect}>
            <option value="ASC">Tăng dần</option>
            <option value="DESC">Giảm dần</option>
          </select>
        )}

        <input type="text" placeholder="Tìm kiếm sản phẩm..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} className={styles.searchInput} />
      </div>

      <table className={styles.orderTable}>
        <thead>
          <tr className={styles.gradientRow}>
            <th>STT</th>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.products.map(p => p.name).join(', ')}</td>
                <td>{order.products.reduce((sum, p) => sum + p.quantity, 0)}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => setSelectedOrder(order)} className={styles.actionBtn}>Chi tiết</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">Không có đơn hàng phù hợp.</td></tr>
          )}
        </tbody>
      </table>

      {selectedOrder && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h3 className={styles.popupTitle}>Chi tiết đơn hàng</h3>
            <table className={styles.detailTable}>
              <thead>
                <tr>
                  <th>Tên</th>
                  {selectedOrder.products.map((p, idx) => (
                    <th key={idx}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Số lượng</td>
                  {selectedOrder.products.map((p, idx) => (
                    <td key={idx}>{p.quantity}</td>
                  ))}
                </tr>
                <tr>
                  <td>Trạng thái</td>
                  <td colSpan={selectedOrder.products.length}>
                    <span className={`${styles.statusBadge} ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status === 'Hoàn thành'
                        ? 'Đã giao thành công'
                        : selectedOrder.status === 'Đang giao'
                          ? 'Đơn hàng đang giao'
                          : 'Đơn hàng bị hủy'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className={styles.popupButtons}>
              <button
                className={styles.actionBtn}
                disabled={selectedOrder.status !== 'Hoàn thành' && selectedOrder.status !== 'Đã hủy'}
              >
                Đánh giá
              </button>

              <button
                className={styles.actionBtn}
                disabled={selectedOrder.status === 'Đang giao'}
              >
                Mua lại
              </button>
            </div>



            <button onClick={() => setSelectedOrder(null)} className={styles.closeBtn}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderManagement;
