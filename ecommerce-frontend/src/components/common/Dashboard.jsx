import React from "react";
import styles from "./Dashboard.module.css";
function Dashboard({ title, columns, data, onEdit, onDelete }) {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {item[col.key]}
                  </td>
                ))}
                <td>
                  {onEdit && (
                    <button className={styles.editBtn} onClick={() => onEdit(item)}>✏ Sửa</button>
                  )}
                  {onDelete && (
                    <button className={styles.deleteBtn} onClick={() => onDelete(item.id)}>🗑 Xóa</button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} style={{ textAlign: "center", color: "#888" }}>
                Không có dữ liệu.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
