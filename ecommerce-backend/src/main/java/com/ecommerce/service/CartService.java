package com.ecommerce.service;

import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.ClothingProduct;
import com.ecommerce.model.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    public void addToCart(String userId, Product product, int quantity, String size) {
        Cart cart = Cart.getInstance(userId);
        cart.addItem(product, quantity, size);
    }

    public boolean isProductInCart(String userId, String productId) {
        Cart cart = Cart.getInstance(userId);
        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(productId)) {
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
        // Tùy chọn: Cart.removeInstance(userId); // Xóa hoàn toàn instance nếu muốn
    }

    public double getTotal(String userId) {
        Cart cart = Cart.getInstance(userId);
        return cart.getTotal();
    }
}