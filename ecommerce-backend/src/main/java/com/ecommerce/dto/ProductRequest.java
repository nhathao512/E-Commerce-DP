package com.ecommerce.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ProductRequest {
    private String type;
    private String name;
    private String description;
    private Double price;
    private String categoryId;
    private String imageUrl;
    private List<String> sizes = new ArrayList<>();
    private Map<String, Integer> quantity = new HashMap<>();
    private String material;
    private String sole;

    // Getters và Setters
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }


    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getSizes() {
        return sizes;
    }

    public void setSizes(List<String> sizes) {
        this.sizes = sizes;
    }

    public Map<String, Integer> getQuantity() {
        return quantity;
    }

    public void setQuantity(Map<String, Integer> quantity) {
        this.quantity = quantity;
    }

    public String getMaterial() {return this.material;};
    public void setMaterial(String material) { this.material = material; }

    public String getSole() { return sole; }
    public void setSole(String sole) { this.sole = sole; }
}