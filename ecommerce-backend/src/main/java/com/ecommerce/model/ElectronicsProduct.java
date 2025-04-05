package com.ecommerce.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
public class ElectronicsProduct extends Product {
    private String warranty;

    public String getWarranty() { return warranty; }
    public void setWarranty(String warranty) { this.warranty = warranty; }
}