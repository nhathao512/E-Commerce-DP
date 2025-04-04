package com.ecommerce.dto;


public class ProductRequest {
    // Getters và Setters
    private String type;         // Loại sản phẩm (electronics, clothing)
    private String name;         // Tên sản phẩm

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

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

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getExtraAttribute() {
        return extraAttribute;
    }

    public void setExtraAttribute(String extraAttribute) {
        this.extraAttribute = extraAttribute;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    private double price;        // Giá sản phẩm
    private String categoryId;   // ID danh mục
    private String extraAttribute; // Thuộc tính bổ sung (warranty hoặc size)
    private String imageUrl;     // URL hình ảnh

}