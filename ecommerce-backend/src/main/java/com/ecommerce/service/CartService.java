package com.ecommerce.service;

import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    public void addToCart(String userId, Product product, int quantity, String size) {
        Cart cart = Cart.getInstance(userId);
        cart.addItem(product, quantity, size);
    }

    public boolean isProductInCart(String userId, String productId, String size) {
        Cart cart = Cart.getInstance(userId);
        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(productId) && item.getSize().equals(size)) {
                return true;
            }
        }
        return false;
    }

    public List<CartItem> getCartItems(String userId) {
        Cart cart = Cart.getInstance(userId);
        return cart.getItems();
    }

    public void clearCart(String userId) {
        Cart cart = Cart.getInstance(userId);
        cart.clear();
    }

    public double getTotal(String userId) {
        Cart cart = Cart.getInstance(userId);
        return cart.getTotal();
    }

    public boolean removeFromCart(String userId, String productId, String size) {
        Cart cart = Cart.getInstance(userId);
        return cart.removeItem(productId, size);
    }
}