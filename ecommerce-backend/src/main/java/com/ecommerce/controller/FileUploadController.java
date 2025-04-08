package com.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/upload")
public class FileUploadController {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @PostMapping("/avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam("file") MultipartFile file) {
        try {
            // Kiểm tra file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            if (file.getSize() > 10 * 1024 * 1024) { // > 10MB
                return ResponseEntity.status(413).body("File size exceeds 10MB");
            }
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(415).body("File must be an image");
            }

            // Tạo thư mục avatars nếu chưa tồn tại
            String avatarDir = UPLOAD_DIR + "avatars/";
            File directory = new File(avatarDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Lưu file với timestamp
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destinationFile = new File(avatarDir + fileName);
            file.transferTo(destinationFile);

            // Trả về URL với prefix /images/ để đồng bộ với WebConfig
            String fileUrl = "/images/avatars/" + fileName;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload avatar: " + e.getMessage());
        }
    }

    @PostMapping("/product")
    public ResponseEntity<String> uploadProductImage(@RequestParam("file") MultipartFile file) {
        try {
            // Kiểm tra file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            if (file.getSize() > 10 * 1024 * 1024) { // > 10MB
                return ResponseEntity.status(413).body("File size exceeds 10MB");
            }
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(415).body("File must be an image");
            }

            // Tạo thư mục products nếu chưa tồn tại
            String productDir = UPLOAD_DIR + "products/";
            File directory = new File(productDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Lưu file với timestamp (đồng bộ với ProductController)
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destinationFile = new File(productDir + fileName);
            file.transferTo(destinationFile);

            // Trả về URL (giữ nguyên như bạn yêu cầu)
            String fileUrl = "/uploads/products/" + fileName;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to upload product image: " + e.getMessage());
        }
    }
}