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

    public void addToCart(Product product, int quantity, String size) {
        cart.addItem(product, quantity, size);
    }

    public boolean isProductInCart(String id){
        for(CartItem item : cart.getItems()){
            if(item.getProduct().getId().equals(id)){
                return true;
            }
        }
        return false;
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