package com.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "products")
public class ClothingProduct extends Product {
    @JsonProperty("extraAttribute")
    @Field("size")
    private String size;

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
}