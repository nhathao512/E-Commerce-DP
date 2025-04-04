package com.ecommerce.model;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrderItem {
    // Getters và Setters
    private String productId;
    private int quantity;
    private double price;

    public OrderItem() {}
    public OrderItem(String productId, int quantity, double price) {
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
    }

}