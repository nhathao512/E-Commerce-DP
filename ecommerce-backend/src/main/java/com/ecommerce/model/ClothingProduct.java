package com.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "products")
public class ClothingProduct extends Product {
    private String material;

    public String getMaterial() { return material; }
    public void setMaterial(String material) { this.material = material; }
}