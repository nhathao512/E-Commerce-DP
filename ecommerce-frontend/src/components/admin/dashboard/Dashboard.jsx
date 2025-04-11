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
            <th key="actions">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.id || `row-${index}`}>
                {columns.map((col) => (
                  <td key={`${item.id || index}-${col.key}`}>
                    {col.key === "images"
                      ? item[col.key] && item[col.key].length > 0
                        ? item[col.key].map((img, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={img}
                              alt={`Product Image ${imgIndex + 1}`}
                              style={{
                                width: "30px",
                                height: "30px",
                                marginRight: "5px",
                              }}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/30";
                              }}
                            />
                          ))
                        : "Không có ảnh"
                      : item[col.key]}
                  </td>
                ))}
                <td key={`${item.id || index}-actions`}>
                  {onEdit && (
                    <button
                      className={styles.editBtn}
                      onClick={() => onEdit(item)}
                    >
                      ✏ Sửa
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => onDelete(item.id)}
                    >
                      🗑 Xóa
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr key="no-data">
              <td
                colSpan={columns.length + 1}
                style={{ textAlign: "center", color: "#888" }}
              >
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
