package com.ecommerce.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
public class ShoeProduct extends Product {
    private String sole;

    public String getSole() { return sole; }
    public void setSole(String sole) { this.sole = sole; }
}