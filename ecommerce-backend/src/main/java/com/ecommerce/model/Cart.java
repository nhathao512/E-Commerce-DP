package com.ecommerce.model;

import com.ecommerce.observer.CartObserver;

import java.util.ArrayList;
import java.util.List;

public class Cart {
    private static Cart instance; // Singleton Pattern
    private List<CartItem> items;
    private List<CartObserver> observers; // Observer Pattern

    private Cart() {
        items = new ArrayList<>();
        observers = new ArrayList<>();
    }

    // Singleton: Lấy instance duy nhất của Cart
    public static Cart getInstance() {
        if (instance == null) {
            synchronized (Cart.class) {
                if (instance == null) {
                    instance = new Cart();
                }
            }
        }
        return instance;
    }

    // Thêm sản phẩm vào giỏ hàng
    public void addItem(Product product, int quantity) {
        CartItem item = new CartItem(product, quantity);
        items.add(item);
        notifyObservers(); // Thông báo cho các observer
    }

    // Lấy danh sách sản phẩm trong giỏ
    public List<CartItem> getItems() {
        return items;
    }

    // Xóa toàn bộ giỏ hàng
    public void clear() {
        items.clear();
        notifyObservers();
    }

    // Tính tổng tiền
    public double getTotal() {
        return items.stream().mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity()).sum();
    }

    // Observer Pattern: Đăng ký observer
    public void addObserver(CartObserver observer) {
        observers.add(observer);
    }

    // Observer Pattern: Hủy đăng ký observer
    public void removeObserver(CartObserver observer) {
        observers.remove(observer);
    }

    // Observer Pattern: Thông báo khi giỏ hàng thay đổi
    private void notifyObservers() {
        int itemCount = items.size();
        for (CartObserver observer : observers) {
            observer.update(itemCount);
        }
    }
}