package com.ecommerce.dto;

public class UserCount {
    String username;
    String fullName;
    int count;

    public UserCount(String username, String fullName, int count) {
        this.username = username;
        this.fullName = fullName;
        this.count = count;
    }

    public String getUsername() { return username; }
    public String getFullName() { return fullName; }
    public int getCount() { return count; }
}