import React from "react";
import styles from "./Dashboard.module.css";

function Dashboard({ title, columns, data, onEdit, onDelete, onImages }) {
  // Helper function to format the size value for display
  const formatSize = (size) => {
    if (size === null || size === undefined) {
      return "N/A";
    }
    if (typeof size === "string" || typeof size === "number") {
      return size.toString();
    }
    if (Array.isArray(size)) {
      return size.join(", "); // e.g., [10, 20] -> "10, 20"
    }
    if (typeof size === "object") {
      // Handle specific object structures
      if (size.width && size.height) {
        return `${size.width}x${size.height}`; // e.g., { width: 10, height: 20 } -> "10x20"
      }
      // Fallback for other objects: convert to a readable string
      try {
        return JSON.stringify(size, null, 2).replace(/[\n\r]+/g, " "); // Pretty-print object
      } catch (e) {
        console.warn("Failed to stringify size:", size, e);
        return "Complex Size Object";
      }
    }
    return "Unknown";
  };

  // New helper function to format the quantity object
  const formatQuantity = (quantity) => {
    if (quantity === null || quantity === undefined) {
      return "N/A";
    }
    if (typeof quantity === "string") {
      return quantity; // If quantity is already a string, return it
    }
    if (typeof quantity === "object" && quantity !== null) {
      // Format object like { "Size 1": 10, "Size 2": 20 } into "Size 1: 10, Size 2: 20"
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
                  // Debug: Log the value to inspect its structure
                  if (col.key === "size" || col.key === "quantityDisplay") {
                    console.log(`Value for ${col.key} in item ${item.id || index}:`, value);
                  }
                  return (
                    <td key={`${item.id || index}-${col.key}`}>
                      {col.render
                        ? col.render(item) // Use custom render if provided
                        : col.key === "size"
                        ? formatSize(value) // Use formatSize for size
                        : col.key === "quantityDisplay"
                        ? value // Use the pre-rendered quantityDisplay (already a JSX element)
                        : col.key === "quantity"
                        ? formatQuantity(value) // Use formatQuantity for raw quantity
                        : typeof value === "object" && value !== null
                        ? (() => {
                            try {
                              return JSON.stringify(value);
                            } catch (e) {
                              console.warn(`Failed to stringify ${col.key}:`, value, e);
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