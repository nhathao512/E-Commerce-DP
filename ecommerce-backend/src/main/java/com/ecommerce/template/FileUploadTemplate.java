package com.ecommerce.template;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

public abstract class FileUploadTemplate {
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    // Phương thức template định nghĩa quy trình upload
    public final <T> T upload(MultipartFile file, String existingFileUrl) throws IOException {
        validateFile(file); // Bước 1: Kiểm tra file
        String subDir = getSubDirectory(); // Bước 2: Lấy thư mục lưu trữ
        String fileUrl = saveFile(file, subDir, existingFileUrl); // Bước 3: Lưu file
        return postProcess(fileUrl); // Bước 4: Xử lý sau upload
    }

    // Kiểm tra file (bước cố định)
    protected void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Tệp trống");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Kích thước tệp vượt quá 10MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Tệp phải là hình ảnh");
        }
    }

    // Lưu file (bước cố định, có thể override nếu cần)
    protected String saveFile(MultipartFile file, String subDir, String existingFileUrl) throws IOException {
        String fullDir = UPLOAD_DIR + subDir + "/";
        File directory = new File(fullDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Xóa file cũ nếu có
        if (existingFileUrl != null && !existingFileUrl.equals(getDefaultFileUrl())) {
            String oldFilePath = UPLOAD_DIR + subDir + "/" + existingFileUrl.substring(existingFileUrl.lastIndexOf("/") + 1);
            File oldFile = new File(oldFilePath);
            if (oldFile.exists()) {
                oldFile.delete();
            }
        }

        // Lưu file mới
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File destinationFile = new File(fullDir + fileName);
        file.transferTo(destinationFile);
        return "/api/images/" + subDir + "/" + fileName;
    }

    // Các phương thức trừu tượng mà lớp con phải triển khai
    protected abstract String getSubDirectory();
    protected abstract <T> T postProcess(String fileUrl);

    // Phương thức mặc định cho URL file mặc định (có thể override)
    protected String getDefaultFileUrl() {
        return "/api/images/avatars/default-avatar.png";
    }
}