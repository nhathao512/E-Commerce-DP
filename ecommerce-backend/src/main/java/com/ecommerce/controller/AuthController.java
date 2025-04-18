package com.ecommerce.controller;

import com.ecommerce.dto.LoginRequest;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.dto.UserResponse;
import com.ecommerce.model.User;
import com.ecommerce.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
            UserResponse errorResponse = new UserResponse("Tên đăng nhập hoặc mật khẩu không đúng");
            errorResponse.setUsername(loginRequest.getUsername());
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = authService.getAllUsers();
        List<UserResponse> userResponses = users.stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userResponses);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        try {
            authService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body("User not found: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@RequestParam("username") String username) {
        try {
            UserResponse userResponse = authService.getCurrentUser(username);
            return ResponseEntity.ok(userResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(new UserResponse("Không tìm thấy người dùng: " + e.getMessage()));
        }
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "avatar", required = false) String avatar,
            @RequestParam("username") String username) {
        try {
            UserResponse userResponse = authService.updateUser(username, phone, address, fullName, avatar);
            return ResponseEntity.ok(userResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(new UserResponse("Không tìm thấy người dùng: " + e.getMessage()));
        }
    }

    @GetMapping("/role")
    public ResponseEntity<Integer> getUserRole(@RequestParam("username") String username) {
        try {
            UserResponse userResponse = authService.getCurrentUser(username);
            return ResponseEntity.ok(userResponse.getRole());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(-1);
        }
    }
}