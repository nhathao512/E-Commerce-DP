package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.observer.CartObserver;
import com.ecommerce.observer.CartSubject;
import com.ecommerce.singleton.ShoppingCart;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    private ShoppingCart cart = ShoppingCart.getInstance();
    private CartSubject cartSubject = new CartSubject();

    public void addToCart(Product product) {
        cart.addItem(product);
        cartSubject.addProduct(product); // Thông báo cập nhật
    }

    public List<Product> getCartItems() {
        return cart.getItems();
    }

    public double getTotal() {
        return cart.getTotal();
    }

    public void clearCart() {
        cart.clear();
    }

    public void registerObserver(CartObserver observer) {
        cartSubject.addObserver(observer);
    }
}