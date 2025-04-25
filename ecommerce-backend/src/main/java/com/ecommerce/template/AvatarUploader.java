package com.ecommerce.template;

import com.ecommerce.dto.UserResponse;
import com.ecommerce.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class AvatarUploader extends FileUploadTemplate {
    private final AuthService authService;
    private String username;

    @Autowired
    public AvatarUploader(AuthService authService) {
        this.authService = authService;
    }

    public UserResponse uploadAvatar(MultipartFile file, String username) throws IOException {
        this.username = username;
        UserResponse currentUser = authService.getCurrentUser(username);
        return upload(file, currentUser.getAvatar());
    }

    @Override
    protected String getSubDirectory() {
        return "avatars";
    }

    @Override
    protected UserResponse postProcess(String fileUrl) {
        return authService.updateUser(username, null, null, null, fileUrl);
    }
}