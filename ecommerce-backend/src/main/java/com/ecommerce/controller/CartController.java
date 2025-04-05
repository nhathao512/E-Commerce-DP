package com.ecommerce.controller;

import com.ecommerce.model.Cart;
import com.ecommerce.model.Product;
import com.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Void> addToCart(@RequestBody Product product) {
        cartService.addToCart(product);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Product>> getCartItems() {
        List<Product> items = cartService.getCartItems();
        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok().build();
    }
}