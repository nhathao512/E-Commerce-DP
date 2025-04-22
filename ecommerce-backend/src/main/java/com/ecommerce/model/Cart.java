package com.ecommerce.model;

import com.ecommerce.observer.CartObserver;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "carts")
public class Cart {
    @Id
    private String userId;
    private List<CartItem> items;
    private transient List<CartObserver> observers;

    public Cart(String userId) {
        this.userId = userId;
        this.items = new ArrayList<>();
        this.observers = new ArrayList<>();
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

    public void removeItem(String productId, String size) {
        items.removeIf(item -> item.getProduct().getId().equals(productId) && item.getSize().equals(size));
        notifyObservers();
    }

    public List<CartObserver> getObservers() {
        return observers;
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
}