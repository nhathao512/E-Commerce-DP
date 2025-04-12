package com.ecommerce.model;

import com.ecommerce.observer.CartObserver;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Cart {
    private static final Map<String, Cart> instances = new HashMap<>(); // Lưu trữ Cart theo userId
    private String userId; // Liên kết với người dùng
    private List<CartItem> items;
    private List<CartObserver> observers;

    private Cart(String userId) {
        this.userId = userId;
        this.items = new ArrayList<>();
        this.observers = new ArrayList<>();
    }

    // Multiton: Lấy hoặc tạo instance Cart cho userId
    public static Cart getInstance(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("userId cannot be null or empty");
        }
        synchronized (Cart.class) {
            return instances.computeIfAbsent(userId, k -> new Cart(userId));
        }
    }

    // Getter cho userId nếu cần
    public String getUserId() {
        return userId;
    }

    // Thêm sản phẩm vào giỏ hàng
    public void addItem(Product product, int quantity, String size) {
        CartItem item = new CartItem(product, quantity, size);
        items.add(item);
        notifyObservers();
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

    // Xóa instance Cart cho userId (nếu cần, ví dụ khi người dùng đăng xuất)
    public static void removeInstance(String userId) {
        synchronized (Cart.class) {
            instances.remove(userId);
        }
    }
}