package com.ecommerce.dto;

import com.ecommerce.model.*;

import java.util.ArrayList;
import java.util.List;

public class ProductResponse {
    private String id;
    private String productCode;
    private String name;
    private String description;
    private double price;
    private List<String> images = new ArrayList<>();
    private String categoryId;
    private int quantity;
    private String type; // Thay _class bằng type cho dễ đọc
    private String size;    // Dành cho ClothingProduct
    private String color;   // Dành cho ClothingProduct
    private String brand;   // Dành cho HouseholdProduct
    private String warranty; // Dành cho ElectronicsProduct
    private String author;  // Dành cho BookProduct

    public ProductResponse(Product product) {
        this.id = product.getId();
        this.productCode = product.getProductCode();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.images = product.getImages() != null ? product.getImages() : new ArrayList<>();
        this.categoryId = product.getCategoryId();
        this.quantity = product.getQuantity();
        this.type = product.getClass().getSimpleName(); // Dùng getSimpleName() thay vì getName() cho ngắn gọn

        // Gán các thuộc tính đặc trưng dựa trên loại sản phẩm
        if (product instanceof ElectronicsProduct) {
            ElectronicsProduct electronics = (ElectronicsProduct) product;
            this.warranty = electronics.getWarranty();
        } else if (product instanceof ClothingProduct) {
            ClothingProduct clothing = (ClothingProduct) product;
            this.size = clothing.getSize();
            this.color = clothing.getColor();
        } else if (product instanceof HouseholdProduct) {
            HouseholdProduct household = (HouseholdProduct) product;
            this.brand = household.getBrand();
        } else if (product instanceof BookProduct) {
            BookProduct book = (BookProduct) product;
            this.author = book.getAuthor();
        }
    }

    // Getters và Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getWarranty() { return warranty; }
    public void setWarranty(String warranty) { this.warranty = warranty; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
}