package com.ecommerce.template;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

public abstract class FileUploadTemplate {
    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    public final <T> T upload(MultipartFile file, String existingFileUrl) throws IOException {
        validateFile(file);
        String subDir = getSubDirectory();
        String fileUrl = saveFile(file, subDir, existingFileUrl);
        return postProcess(fileUrl);
    }

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

    protected String saveFile(MultipartFile file, String subDir, String existingFileUrl) throws IOException {
        String fullDir = UPLOAD_DIR + subDir + "/";
        File directory = new File(fullDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        if (existingFileUrl != null && !existingFileUrl.equals(getDefaultFileUrl())) {
            String oldFilePath = UPLOAD_DIR + subDir + "/" + existingFileUrl.substring(existingFileUrl.lastIndexOf("/") + 1);
            File oldFile = new File(oldFilePath);
            if (oldFile.exists()) {
                oldFile.delete();
                System.out.println("Đã xóa file cũ: " + oldFilePath);
            }
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File destinationFile = new File(fullDir + fileName);
        file.transferTo(destinationFile);

        System.out.println("Đường dẫn đầy đủ của file vừa lưu: " + destinationFile.getAbsolutePath());
        System.out.println("URL trả về: " + subDir + "/" + fileName);

        return subDir + "/" + fileName;
    }

    protected abstract String getSubDirectory();
    protected abstract <T> T postProcess(String fileUrl);

    protected String getDefaultFileUrl() {
        return "/api/images/avatars/default-avatar.png";
    }
}