package com.ecommerce.model;

import com.ecommerce.observer.CartObserver;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "carts")
public class Cart {
    private static final Map<String, Cart> instances = new HashMap<>();
    @Id
    private String userId;
    private List<CartItem> items;
    private transient List<CartObserver> observers;

    private Cart(String userId) {
        this.userId = userId;
        this.items = new ArrayList<>();
        this.observers = new ArrayList<>();
    }

    public static Cart getInstance(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("ID người dùng không được trống!");
        }
        synchronized (Cart.class) {
            return instances.computeIfAbsent(userId, k -> new Cart(userId));
        }
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) {
        this.items = items;
        notifyObservers();
    }

    public void addItem(Product product, int quantity, String size) {
        for (CartItem item : items) {
            if (item.getProduct().getId().equals(product.getId()) && item.getSize().equals(size)) {
                item.setQuantity(item.getQuantity() + quantity);
                notifyObservers();
                return;
            }
        }
        CartItem newItem = new CartItem(product, quantity, size);
        items.add(newItem);
        notifyObservers();
    }

    public void updateItemQuantity(String productId, String size, int quantity) {
        for (CartItem item : items) {
            if (item.getProduct().getId().equals(productId) && item.getSize().equals(size)) {
                if (quantity <= 0) {
                    items.remove(item);
                } else {
                    item.setQuantity(quantity);
                }
                notifyObservers();
                return;
            }
        }
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
        return items.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();
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