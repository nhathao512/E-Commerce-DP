package com.ecommerce.controller;

import com.ecommerce.dto.LoginRequest;
import com.ecommerce.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth") // /auth thay vì /api/auth
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.status(201).body(authService.register(loginRequest.getUsername(), loginRequest.getPassword()));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest.getUsername(), loginRequest.getPassword()));
    }
}