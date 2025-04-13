package com.ecommerce.controller;

import com.ecommerce.model.*;
import com.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Void> addToCart(
            @RequestBody Product product,
            @RequestParam(name = "quantity", defaultValue = "1") int quantity,
            @RequestParam(name = "size", defaultValue = "S") String size,
            @RequestParam String userId) {
        if (product == null || product.getId() == null || product.getName() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Error-Message", "Product is missing required fields (id, name)")
                    .build();
        }
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Error-Message", "userId is required")
                    .build();
        }

        String productId = product.getId();

        if (cartService.isProductInCart(userId, productId, size)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .header("Error-Message", "Product already exists in cart with this size")
                    .build();
        }

        try {
            cartService.addToCart(userId, product, quantity, size);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Error-Message", "Failed to add product to cart: " + e.getMessage())
                    .build();
        }

        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCartItems(@RequestParam String userId) {
        List<CartItem> items = cartService.getCartItems(userId);
        return ResponseEntity.ok(items);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestParam String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromCart(
            @RequestParam String userId,
            @RequestParam String productId,
            @RequestParam String size) {
        boolean removed = cartService.removeFromCart(userId, productId, size);
        if (removed) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .header("Error-Message", "Product not found in cart")
                    .build();
        }
    }
}