package com.ecommerce.service;

import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Autowired
    public AuthService(PasswordEncoder passwordEncoder, UserRepository userRepository) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    public String register(String username, String password) {
        String encodedPassword = passwordEncoder.encode(password); // Mã hóa mật khẩu
        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword);
        userRepository.save(user); // Lưu người dùng vào MongoDB
        return "User registered successfully with username: " + username;
    }

    public String login(String username, String password) {
        // Logic đăng nhập (sẽ cần cải thiện sau)
        return "User logged in successfully with username: " + username;
    }
}