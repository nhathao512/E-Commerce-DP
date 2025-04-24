package com.ecommerce.service;

import com.ecommerce.dto.UserResponse;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public AuthService(PasswordEncoder passwordEncoder, UserRepository userRepository,
                       AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    private String generateShortUserId() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(characters.charAt(random.nextInt(characters.length())));
        }
        String shortId = sb.toString();
        if (userRepository.findByShortUserId(shortId) != null) {
            return generateShortUserId();
        }
        return shortId;
    }

    public String register(String username, String password, String phone, String address, String fullName, String avatar) {
        if (userRepository.findByUsername(username) != null) {
            throw new IllegalArgumentException("Username already exists");
        }
        String encodedPassword = passwordEncoder.encode(password);
        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword);
        user.setPhone(phone);
        user.setAddress(address);
        user.setFullName(fullName);
        user.setAvatar(avatar != null && !avatar.isEmpty() ? avatar : "/Uploads/avatars/default-avatar.png");
        user.setShortUserId(generateShortUserId());
        user.setRole(0); // Mặc định role = 0 cho người dùng mới
        User savedUser = userRepository.save(user);
        return "User registered successfully with username: " + username + " and shortUserId: " + savedUser.getShortUserId();
    }

    public UserResponse login(String username, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            User user = userRepository.findByUsername(username);
            if (user == null) {
                throw new IllegalArgumentException("Invalid username or password");
            }
            String token = jwtTokenProvider.generateToken(user.getUsername(), user.getId());
            UserResponse userResponse = new UserResponse(user);
            userResponse.setToken(token);
            return userResponse;
        } catch (AuthenticationException e) {
            throw new IllegalArgumentException("Invalid username or password");
        }
    }

    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        return new UserResponse(user);
    }

    public UserResponse updateUser(String username, String phone, String address, String fullName, String avatar) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        if (phone != null && !phone.isEmpty()) user.setPhone(phone);
        if (address != null && !address.isEmpty()) user.setAddress(address);
        if (fullName != null && !fullName.isEmpty()) user.setFullName(fullName);
        if (avatar != null && !avatar.isEmpty()) user.setAvatar(avatar);
        User updatedUser = userRepository.save(user);
        return new UserResponse(updatedUser);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        userRepository.delete(user);
    }

    // Thêm phương thức getUserById
    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
    }
}