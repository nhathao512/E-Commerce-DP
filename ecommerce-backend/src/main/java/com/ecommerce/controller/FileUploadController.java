package com.ecommerce.controller;

import com.ecommerce.dto.UserResponse;
import com.ecommerce.template.AvatarUploader;
import com.ecommerce.template.ProductImageUploader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/upload")
public class FileUploadController {
    private final AvatarUploader avatarUploader;
    private final ProductImageUploader productImageUploader;

    @Autowired
    public FileUploadController(AvatarUploader avatarUploader, ProductImageUploader productImageUploader) {
        this.avatarUploader = avatarUploader;
        this.productImageUploader = productImageUploader;
    }

    @PostMapping("/avatar")
    public ResponseEntity<UserResponse> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @RequestParam("username") String username) {
        try {
            UserResponse updatedUser = avatarUploader.uploadAvatar(file, username);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new UserResponse(e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(new UserResponse("Không thể tải ảnh đại diện: " + e.getMessage()));
        }
    }

    @PostMapping("/product")
    public ResponseEntity<String> uploadProductImage(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = productImageUploader.upload(file, null);
            return ResponseEntity.ok(fileUrl);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Không thể tải ảnh sản phẩm: " + e.getMessage());
        }
    }
}