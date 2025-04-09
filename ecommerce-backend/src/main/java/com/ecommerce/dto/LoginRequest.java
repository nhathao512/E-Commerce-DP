package com.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;


public class LoginRequest {
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // Getters và Setters
    private String id; // Giữ lại ID gốc của MongoDB
    private String shortUserId; // Thêm trường shortUserId
    private String username;
    private String password;
    private String phone;
    private String address;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getShortUserId() {
        return shortUserId;
    }

    public void setShortUserId(String shortUserId) {
        this.shortUserId = shortUserId;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}