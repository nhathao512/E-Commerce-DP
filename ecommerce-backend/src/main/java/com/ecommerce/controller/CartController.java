package com.ecommerce.controller;

import com.ecommerce.model.*;
import com.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.awt.print.Book;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Void> addToCart(@RequestBody Product product) {
        if(product instanceof ClothingProduct){
            cartService.addToCart((ClothingProduct) product);
        } else if(product instanceof ElectronicsProduct){
            cartService.addToCart((ElectronicsProduct) product);
        } else if(product instanceof  BookProduct){
            cartService.addToCart((BookProduct) product);
        } else if(product instanceof HouseholdProduct){
            cartService.addToCart((HouseholdProduct) product);
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCartItems() {
        List<CartItem> items = cartService.getCartItems();
        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok().build();
    }
}