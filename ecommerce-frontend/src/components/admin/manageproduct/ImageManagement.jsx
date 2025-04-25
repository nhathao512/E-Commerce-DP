import React, { useState } from "react";
import { X } from "lucide-react";
import styles from "./ImageManagement.module.css";
import API from "../../../services/api";

function ImageManagement({ product, onClose, apiUrl, onUpdateImages }) {
  const [images, setImages] = useState(
    Array.isArray(product.images)
      ? product.images.map((img) => ({
          url: `${apiUrl}/images/${img}`,
          name: img,
        }))
      : []
  );
  const [newImages, setNewImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const MAX_FILES = 5;
  const MAX_SIZE = 5 * 1024 * 1024;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter((file) => {
      if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
        alert(`File ${file.name} không phải định dạng ảnh hợp lệ!`);
        return false;
      }
      if (file.size > MAX_SIZE) {
        alert(`File ${file.name} quá lớn! Kích thước tối đa là 5MB.`);
        return false;
      }
      return true;
    });

    if (selectedFiles.length + images.length + newImages.length > MAX_FILES) {
      alert(`Bạn chỉ có thể upload tối đa ${MAX_FILES} ảnh!`);
      setNewImages([
        ...newImages,
        ...selectedFiles.slice(0, MAX_FILES - images.length - newImages.length),
      ]);
    } else {
      setNewImages([...newImages, ...selectedFiles]);
    }
  };

  const handleDeleteImage = (index) => {
    const deletedImage = images[index];
    setDeletedImages([...deletedImages, deletedImage.name]);
    setImages(images.filter((_, i) => i !== index));
  };

  const handleDeleteNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (newImages.length === 0 && deletedImages.length === 0) {
      alert("Không có thay đổi để lưu!");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("productCode", product.productCode);
    newImages.forEach((file) => formData.append("image", file));
    formData.append("deletedImages", JSON.stringify(deletedImages));

    try {
      const response = await API.post("/products/uploads", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      const updatedProduct = response.data.data;
      onUpdateImages(product.id, updatedProduct);
      setNewImages([]);
      setDeletedImages([]);
      alert("Cập nhật ảnh thành công!");
      onClose();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi khi upload ảnh";
      alert(`Không thể cập nhật ảnh: ${message}`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Quản lý ảnh - {product.name}</h2>
        <div className={styles.form}>
          <div className={styles.formGroup}>
            <div className={styles.imageUpload}>
              <input
                type="file"
                multiple
                accept=".png,.jpg,.jpeg"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              <p className={styles.uploadNote}>
                Tối đa {MAX_FILES} ảnh, mỗi ảnh không quá 5MB (PNG, JPG, JPEG).
              </p>
            </div>
          </div>

          {isSubmitting && (
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          )}

          <div className={styles.imagePreview}>
            {images.map((img, index) => (
              <div
                key={`existing-${index}`}
                className={`${styles.imageWrapper} ${styles.existingImage}`}
              >
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
            {newImages.map((file, index) => (
              <div
                key={`new-${index}`}
                className={`${styles.imageWrapper} ${styles.newImage}`}
              >
                <img src={URL.createObjectURL(file)} alt={`New ${index}`} />
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

          <div className={styles.buttonGroup}>
            <button onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu"}
            </button>
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageManagement;
