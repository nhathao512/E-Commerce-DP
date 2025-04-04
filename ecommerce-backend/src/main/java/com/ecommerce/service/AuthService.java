package com.ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final PasswordEncoder passwordEncoder;

    // Autowiring PasswordEncoder
    @Autowired
    public AuthService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public String register(String username, String password) {
        String encodedPassword = passwordEncoder.encode(password);  // Encrypting the password
        // Save username and encodedPassword into the database (this is just a placeholder)
        return "User registered successfully with username: " + username;
    }

    public String login(String username, String password) {
        // Verify the password (in a real case, you would compare the encoded password from the database)
        return "User logged in successfully with username: " + username;
    }
}
