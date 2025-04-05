package com.ecommerce.dto;

import com.ecommerce.model.ClothingProduct;
import com.ecommerce.model.ElectronicsProduct;
import com.ecommerce.model.Product;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

public class ProductResponse {
    private String id;
    private String productCode; // Thêm trường này
    private String name;
    private String description;
    private double price;
    private List<String> images = new ArrayList<>();
    private String categoryId;
    private int quantity;
    private String extraAttribute;

    public ProductResponse(Product product) {
        this.id = product.getId();
        this.productCode = product.getProductCode();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.images = product.getImages();
        this.categoryId = product.getCategoryId();
        this.quantity = product.getQuantity();

        if (product instanceof ElectronicsProduct) {
            this.extraAttribute = ((ElectronicsProduct) product).getWarranty();
        } else if (product instanceof ClothingProduct) {
            this.extraAttribute = ((ClothingProduct) product).getSize();
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
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

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getExtraAttribute() {
        return extraAttribute;
    }

    public void setExtraAttribute(String extraAttribute) {
        this.extraAttribute = extraAttribute;
    }
}