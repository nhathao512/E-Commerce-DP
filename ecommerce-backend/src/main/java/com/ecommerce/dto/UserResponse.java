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
    private String token;
    private String error;
    private int role;

    public UserResponse(User user) {
        this.id = user.getId();
        this.shortUserId = user.getShortUserId();
        this.username = user.getUsername();
        this.fullName = user.getFullName();
        this.avatar = user.getAvatar();
        this.phone = user.getPhone();
        this.address = user.getAddress();
        this.role = user.getRole();
        this.error = null;
    }

    public UserResponse() {
        this.id = null;
        this.shortUserId = null;
        this.username = null;
        this.fullName = null;
        this.avatar = null;
        this.phone = null;
        this.address = null;
        this.role = 0;
        this.error = null;
    }

    public UserResponse(String error) {
        this.id = null;
        this.shortUserId = null;
        this.username = null;
        this.fullName = null;
        this.avatar = null;
        this.phone = null;
        this.address = null;
        this.role = 0;
        this.error = error;
    }

    public UserResponse(String id, String shortUserId, String username, String fullName, String avatar, String phone, String address, int role) {
        this.id = id;
        this.shortUserId = shortUserId;
        this.username = username;
        this.fullName = fullName;
        this.avatar = avatar;
        this.phone = phone;
        this.address = address;
        this.role = role;
        this.error = null;
    }

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
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public int getRole() { return role; }
    public void setRole(int role) { this.role = role; }

    @Override
    public String toString() {
        return "UserResponse{" +
                "id='" + id + '\'' +
                ", shortUserId='" + shortUserId + '\'' +
                ", username='" + username + '\'' +
                ", fullName='" + fullName + '\'' +
                ", avatar='" + avatar + '\'' +
                ", phone='" + phone + '\'' +
                ", address='" + address + '\'' +
                ", role=" + role +
                ", error='" + error + '\'' +
                '}';
    }
}