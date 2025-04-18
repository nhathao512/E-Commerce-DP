package com.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    @Id
    private String id; // ID gốc của MongoDB
    private String shortUserId; // shortUserId
    private String username;
    private String password;
    private String phone;
    private String address;
    private String fullName; // Thêm trường Họ và tên
    private String avatar; // Thêm trường Ảnh đại diện (URL hoặc đường dẫn)
    private int role; // Thêm trường role (0 = user, 1 = admin)

    // Constructors
    public User() {
        this.role = 0; // Mặc định role = 0 khi tạo mới
    }

    // Getters và Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getShortUserId() { return shortUserId; }
    public void setShortUserId(String shortUserId) { this.shortUserId = shortUserId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public int getRole() { return role; }
    public void setRole(int role) { this.role = role; }
}