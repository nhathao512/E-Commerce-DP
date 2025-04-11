package com.ecommerce.template;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class ProductImageUploader extends FileUploadTemplate {
    @Override
    protected String getSubDirectory() {
        return "products";
    }

    @Override
    protected String postProcess(String fileUrl) {
        return fileUrl; // Chỉ trả về URL
    }

    // Upload nhiều ảnh
    public List<String> uploadMultipleImages(List<MultipartFile> files) throws IOException {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.getSize() == 0) {
                continue; // Bỏ qua file rỗng
            }
            urls.add(upload(file, null)); // Gọi phương thức upload từ lớp cha
        }
        return urls;
    }
}