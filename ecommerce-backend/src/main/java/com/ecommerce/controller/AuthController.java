package com.ecommerce.controller;

import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.dto.UserResponse;
import com.ecommerce.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        try {
            return ResponseEntity.status(201).body(authService.register(
                    registerRequest.getUsername(),
                    registerRequest.getPassword(),
                    registerRequest.getPhone(),
                    registerRequest.getAddress(),
                    registerRequest.getFullName(),
                    registerRequest.getAvatar()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            UserResponse userResponse = authService.login(loginRequest.getUsername(), loginRequest.getPassword());
            return ResponseEntity.ok(userResponse);
        } catch (IllegalArgumentException e) {
            // Trả về UserResponse với thông tin lỗi thay vì String
            UserResponse errorResponse = new UserResponse(null); // null để biểu thị không có user
            errorResponse.setId(null); // Không có token
            errorResponse.setUsername(loginRequest.getUsername());
            errorResponse.setFullName(null);
            errorResponse.setAvatar(null);
            errorResponse.setShortUserId(null);
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
}