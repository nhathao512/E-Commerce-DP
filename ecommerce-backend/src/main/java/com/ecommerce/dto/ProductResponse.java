package com.ecommerce.dto;

import com.ecommerce.model.*;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductResponse {
    private String id;
    private String productCode;
    private String name;
    private String description;
    private Double price;
    private List<String> images = new ArrayList<>();
    private String categoryId;
    private List<String> sizes = new ArrayList<>();
    private Map<String, Integer> quantity = new HashMap<>();
    private String _class;
    private String material;
    private String type;
    private String sole;

    public ProductResponse(Product product) {
        this.id = product.getId();
        this.productCode = product.getProductCode();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.images = product.getImages() != null ? product.getImages() : new ArrayList<>();
        this.categoryId = product.getCategoryId();
        this.quantity = product.getQuantity() != null ? product.getQuantity() : new HashMap<>();
        this.sizes = product.getSizes() != null ? product.getSizes() : new ArrayList<>();
        this._class = product.getClass().getName();

        if (product instanceof ClothingProduct) {
            this.type = "Clothing";
            this.material = ((ClothingProduct) product).getMaterial();
        } else if (product instanceof ShoeProduct) {
            this.type = "Shoe";
            this.sole = ((ShoeProduct) product).getSole();
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String get_class() {
        return _class;
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

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
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

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public String getSole() {
        return sole;
    }

    public void setSole(String sole) {
        this.sole = sole;
    }

    public String getType() {return this.type;}

    public void setType(String type) {this.type = type;}

}