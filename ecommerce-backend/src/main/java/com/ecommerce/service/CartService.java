package com.ecommerce.service;

import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.ClothingProduct;
import com.ecommerce.model.Product;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {
    private final Cart cart = Cart.getInstance();

    public void addToCart(Product product) {
        cart.addItem(product, 1);
    }

    public List<CartItem> getCartItems() {
        return cart.getItems();
    }

    public Cart getCart() {
        return cart;
    }

    public void clearCart() {
        cart.clear();
    }

    public double getTotal() {
        return cart.getTotal(); // Gọi phương thức getTotal từ Cart
    }
}