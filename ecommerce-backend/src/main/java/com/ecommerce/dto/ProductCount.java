package com.ecommerce.dto;

public class ProductCount {
    String name;
    int count;

    public ProductCount(String name, int count) {
        this.name = name;
        this.count = count;
    }

    public String getName() { return name; }
    public int getCount() { return count; }
}
