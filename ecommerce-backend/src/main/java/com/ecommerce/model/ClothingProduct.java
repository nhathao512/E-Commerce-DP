package com.ecommerce.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
public class ClothingProduct extends Product {
    private String size;

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
}