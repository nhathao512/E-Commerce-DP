package com.ecommerce.model;

import com.ecommerce.observer.CartObserver;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Cart {
    private static final Map<String, Cart> instances = new HashMap<>();
    private String userId;
    private List<CartItem> items;
    private List<CartObserver> observers;

    private Cart(String userId) {
        this.userId = userId;
        this.items = new ArrayList<>();
        this.observers = new ArrayList<>();
    }

    public static Cart getInstance(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("userId cannot be null or empty");
        }
        synchronized (Cart.class) {
            return instances.computeIfAbsent(userId, k -> new Cart(userId));
        }
    }

    public String getUserId() {
        return userId;
    }

    public void addItem(Product product, int quantity, String size) {
        CartItem item = new CartItem(product, quantity, size);
        items.add(item);
        notifyObservers();
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void clear() {
        items.clear();
        notifyObservers();
    }

    public boolean removeItem(String productId, String size) {
        boolean removed = items.removeIf(item ->
                item.getProduct().getId().equals(productId) && item.getSize().equals(size));
        if (removed) {
            notifyObservers();
        }
        return removed;
    }

    public double getTotal() {
        return items.stream().mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity()).sum();
    }

    public void addObserver(CartObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(CartObserver observer) {
        observers.remove(observer);
    }

    private void notifyObservers() {
        int itemCount = items.size();
        for (CartObserver observer : observers) {
            observer.update(itemCount);
        }
    }

    public static void removeInstance(String userId) {
        synchronized (Cart.class) {
            instances.remove(userId);
        }
    }
}