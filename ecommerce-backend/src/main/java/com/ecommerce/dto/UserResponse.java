package com.ecommerce.dto;

import com.ecommerce.model.User;

public class UserResponse {
    private String id;
    private String shortUserId;
    private String username;
    private String fullName;
    private String avatar;
    private String phone;
    private String address;

    public UserResponse(User user) {
        this.id = user.getId();
        this.shortUserId = user.getShortUserId();
        this.username = user.getUsername();
        this.fullName = user.getFullName();
        this.avatar = user.getAvatar();
        this.phone = user.getPhone();    // Thêm phone
        this.address = user.getAddress(); // Thêm address
    }

    // Getters và Setters (giữ nguyên như code của bạn)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getShortUserId() { return shortUserId; }
    public void setShortUserId(String shortUserId) { this.shortUserId = shortUserId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}