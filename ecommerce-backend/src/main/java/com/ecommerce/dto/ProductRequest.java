package com.ecommerce.dto;

public class ProductRequest {
    private String type;
    private String name;
    private String description;
    private double price;
    private String categoryId;
    private int quantity;
    private String imageUrl; // Giữ nguyên để tạo sản phẩm với một ảnh ban đầu
    private String[] extraAttributes;

    // Getters và Setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String[] getExtraAttributes() { return extraAttributes; }
    public void setExtraAttributes(String... extraAttributes) { this.extraAttributes = extraAttributes; }
}