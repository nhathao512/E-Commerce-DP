package com.ecommerce.controller;

import com.ecommerce.dto.UserResponse;
import com.ecommerce.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/upload")
public class FileUploadController {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @Autowired
    private AuthService authService;

    @PostMapping("/avatar")
    public ResponseEntity<UserResponse> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @RequestParam("username") String username) {
        try {
            // Kiểm tra file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(new UserResponse("Tệp trống"));
            }
            if (file.getSize() > 10 * 1024 * 1024) { // > 10MB
                return ResponseEntity.status(413).body(new UserResponse("Kích thước tệp vượt quá 10MB"));
            }
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(415).body(new UserResponse("Tệp phải là hình ảnh"));
            }

            // Tạo thư mục avatars nếu chưa tồn tại
            String avatarDir = UPLOAD_DIR + "avatars/";
            File directory = new File(avatarDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Lấy thông tin người dùng hiện tại để kiểm tra avatar cũ
            UserResponse currentUser = authService.getCurrentUser(username);
            String oldAvatar = currentUser.getAvatar();
            if (oldAvatar != null && !oldAvatar.equals("/api/images/avatars/default-avatar.png")) {
                // Xóa ảnh cũ nếu không phải ảnh mặc định
                String oldFilePath = UPLOAD_DIR + "avatars/" + oldAvatar.substring(oldAvatar.lastIndexOf("/") + 1);
                File oldFile = new File(oldFilePath);
                if (oldFile.exists()) {
                    oldFile.delete();
                }
            }

            // Lưu file với timestamp
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destinationFile = new File(avatarDir + fileName);
            file.transferTo(destinationFile);

            // Tạo URL ảnh mới với tiền tố /api/
            String fileUrl = "/api/images/avatars/" + fileName;

            // Cập nhật avatar trong MongoDB qua AuthService và lấy thông tin người dùng mới nhất
            UserResponse updatedUser = authService.updateUser(username, null, null, null, fileUrl);

            return ResponseEntity.ok(updatedUser);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(new UserResponse("Không thể tải ảnh đại diện: " + e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(new UserResponse("Không tìm thấy người dùng: " + e.getMessage()));
        }
    }

    @PostMapping("/product")
    public ResponseEntity<String> uploadProductImage(@RequestParam("file") MultipartFile file) {
        try {
            // Kiểm tra file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Tệp trống");
            }
            if (file.getSize() > 10 * 1024 * 1024) { // > 10MB
                return ResponseEntity.status(413).body("Kích thước tệp vượt quá 10MB");
            }
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(415).body("Tệp phải là hình ảnh");
            }

            // Tạo thư mục products nếu chưa tồn tại
            String productDir = UPLOAD_DIR + "products/";
            File directory = new File(productDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Lưu file với timestamp
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            File destinationFile = new File(productDir + fileName);
            file.transferTo(destinationFile);

            // Trả về URL với tiền tố /api/
            String fileUrl = "/api/images/products/" + fileName;
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Không thể tải ảnh sản phẩm: " + e.getMessage());
        }
    }
}