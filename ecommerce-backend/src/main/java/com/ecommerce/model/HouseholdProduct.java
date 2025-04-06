package com.ecommerce.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")

public class HouseholdProduct extends Product {
    private String brand;

    public String getBrand() {return brand;}
    public void setBrand(String brand) {this.brand = brand;}
}
