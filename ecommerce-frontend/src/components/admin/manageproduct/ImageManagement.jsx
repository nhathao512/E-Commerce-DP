import React, { useState } from "react";
import { X } from "lucide-react";
import styles from "./ProductManagement.module.css";
import API from "../../../services/api";

function ImageManagement({ product, onClose, apiUrl, onUpdateImages }) {
  const [images, setImages] = useState(
    Array.isArray(product.images)
      ? product.images.map((img) => ({ url: `${apiUrl}/images/${img}`, name: img }))
      : []
  );
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý khi chọn file ảnh
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) =>
      ["image/png", "image/jpeg", "image/jpg"].includes(file.type)
    );
    setNewImages(selectedFiles);
  };

  // Xóa ảnh hiện có
  const handleDeleteImage = (index) => {
    const deletedImage = images[index];
    setDeletedImages([...deletedImages, deletedImage.name]);
    setImages(images.filter((_, i) => i !== index));
  };

  // Xóa ảnh mới được chọn
  const handleDeleteNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  // Gửi yêu cầu cập nhật ảnh
  const handleSave = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("productCode", product.productCode);
    newImages.forEach((file) => formData.append("image", file));
    formData.append("deletedImages", JSON.stringify(deletedImages));

    try {
      const response = await API.post("/products/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Cập nhật danh sách ảnh với các URL mới từ server
      const updatedProduct = response.data.data;
      onUpdateImages(product.id, updatedProduct);
      setNewImages([]);
      setDeletedImages([]);
      alert("Cập nhật ảnh thành công!");
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật ảnh:", error);
      alert(
        `Không thể cập nhật ảnh: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>Quản lý ảnh - {product.name}</h2>
        <div className={styles.imageUpload}>
          <input
            type="file"
            multiple
            accept=".png,.jpg,.jpeg"
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
        </div>
        <div className={styles.imagePreview}>
          {/* Hiển thị ảnh hiện có */}
          {images.map((img, index) => (
            <div key={`existing-${index}`} className={styles.imageWrapper}>
              <img src={img.url} alt={`Product ${index}`} />
              <button
                type="button"
                onClick={() => handleDeleteImage(index)}
                className={styles.imageDeleteButton}
                title="Xóa ảnh"
                disabled={isSubmitting}
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {/* Hiển thị preview ảnh mới được chọn */}
          {newImages.map((file, index) => (
            <div key={`new-${index}`} className={styles.imageWrapper}>
              <img
                src={URL.createObjectURL(file)}
                alt={`New ${index}`}
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
              <button
                type="button"
                onClick={() => handleDeleteNewImage(index)}
                className={styles.imageDeleteButton}
                title="Xóa ảnh mới"
                disabled={isSubmitting}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <div className={styles.popupButtons}>
          <button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageManagement;