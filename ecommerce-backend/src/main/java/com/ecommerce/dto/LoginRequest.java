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
    private String username;
    private String password;

}