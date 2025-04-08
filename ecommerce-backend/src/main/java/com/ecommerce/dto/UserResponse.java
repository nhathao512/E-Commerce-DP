package com.ecommerce.dto;

import com.ecommerce.model.User;
import lombok.Getter;
import lombok.Setter;

public class UserResponse {
    private String id;
    private String shortUserId;
    private String username;
    private String fullName; // Thêm fullName
    private String avatar;   // Thêm avatar

    public UserResponse(User user) {
        this.id = user.getId();
        this.shortUserId = user.getShortUserId();
        this.username = user.getUsername();
        this.fullName = user.getFullName();
        this.avatar = user.getAvatar();
    }

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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}