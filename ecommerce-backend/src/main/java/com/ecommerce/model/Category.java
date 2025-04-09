package com.ecommerce.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@Document(collection = "categories")
public class Category {
    // Getters và Setters
    @Id
    private String id;
    private String name;
    private String icon;

    public Category() {}
    public Category(String name, String icon) { 
        this.name = name; 
        this.icon = icon; 
    }

}