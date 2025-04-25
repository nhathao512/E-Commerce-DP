import React from "react";
import styles from "./Dashboard.module.css";

function Dashboard({ title, columns, data, onEdit, onDelete, onImages }) {
  const formatSize = (size) => {
    if (size === null || size === undefined) {
      return "N/A";
    }
    if (typeof size === "string" || typeof size === "number") {
      return size.toString();
    }
    if (Array.isArray(size)) {
      return size.join(", ");
    }
    if (typeof size === "object") {
      if (size.width && size.height) {
        return `${size.width}x${size.height}`;
      }
      try {
        return JSON.stringify(size, null, 2).replace(/[\n\r]+/g, " ");
      } catch (e) {
        console.warn("Failed to stringify size:", size, e);
        return "Complex Size Object";
      }
    }
    return "Unknown";
  };

  const formatQuantity = (quantity) => {
    if (quantity === null || quantity === undefined) {
      return "N/A";
    }
    if (typeof quantity === "string") {
      return quantity;
    }
    if (typeof quantity === "object" && quantity !== null) {
      return Object.entries(quantity)
        .map(([size, qty]) => `${size}: ${qty}`)
        .join(", ");
    }
    if (typeof quantity === "number") {
      return quantity.toString();
    }
    return "Unknown";
  };

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
                {columns.map((col) => {
                  const value = item[col.key];
                  return (
                    <td key={`${item.id || index}-${col.key}`}>
                      {col.render
                        ? col.render(item)
                        : col.key === "size"
                        ? formatSize(value)
                        : col.key === "quantityDisplay"
                        ? value
                        : col.key === "quantity"
                        ? formatQuantity(value)
                        : typeof value === "object" && value !== null
                        ? (() => {
                            try {
                              return JSON.stringify(value);
                            } catch (e) {
                              console.warn(
                                `Failed to stringify ${col.key}:`,
                                value,
                                e
                              );
                              return "Complex Object";
                            }
                          })()
                        : value}
                    </td>
                  );
                })}
                <td
                  key={`${item.id || index}-actions`}
                  className={styles.actions}
                >
                  {onEdit && (
                    <button
                      className={styles.editBtn}
                      onClick={() => onEdit(item)}
                    >
                      Sửa
                    </button>
                  )}
                  {onImages && (
                    <button
                      className={styles.imagesBtn}
                      onClick={() => onImages(item)}
                    >
                      Ảnh
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => onDelete(item.id)}
                    >
                      Xóa
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
