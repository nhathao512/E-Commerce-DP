package com.ecommerce.dto;

import com.ecommerce.model.User;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserResponse {
    // Getters và Setters
    private String id;
    private String username;

    public UserResponse(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
    }

}