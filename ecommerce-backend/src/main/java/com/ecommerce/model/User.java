package com.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String shortUserId;
    private String username;
    private String password;
    private String phone;
    private String address;
    private String fullName;
    private String avatar;
    private int role;

    public User() {
        this.role = 0;
    }

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