package com.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "products")
@JsonTypeInfo(
        use = JsonTypeInfo.Id.CLASS,
        include = JsonTypeInfo.As.PROPERTY,
        property = "_class"
)
public abstract class Product {
    @Id
    private String id;
    private String productCode; // Trường mới, ngắn gọn và duy nhất
    private String name;
    private String description;
    private Double price;
    private List<String> images = new ArrayList<>();
    private String categoryId;
    private List<String> sizes = new ArrayList<>();
    private Map<String, Integer> quantity = new HashMap<>();

    // Getters và Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public void addImage(String image) { this.images.add(image); }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public List<String> getSizes() { return sizes; }
    public void setSizes(List<String> sizes) { this.sizes = sizes; }
    public void addSize(String size) { this.sizes.add(size); }

    public Map<String, Integer> getQuantity() { return quantity; }
    public void setQuantity(Map<String, Integer> quantity) { this.quantity = quantity; }

    // Phương thức tiện ích để cập nhật số lượng cho một kích thước cụ thể
    public void updateQuantity(String size, Integer qty) {
        this.quantity.put(size, qty);
    }

    // Phương thức tiện ích để lấy số lượng của một kích thước cụ thể
    public Integer getQuantityForSize(String size) {
        return this.quantity.getOrDefault(size, 0);
    }
}