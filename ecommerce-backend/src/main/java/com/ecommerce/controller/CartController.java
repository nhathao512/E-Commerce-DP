package com.ecommerce.controller;

import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.service.CartService;
import com.ecommerce.service.ProductService;
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

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<Void> addToCart(
            @RequestBody Product product,
            @RequestParam int quantity,
            @RequestParam String size,
            @RequestParam String userId) {
        try {
            cartService.addToCart(userId, product, quantity, size);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Error-Message", e.getMessage())
                    .build();
        }
    }

    @PutMapping("/update-quantity")
    public ResponseEntity<Void> updateCartItemQuantity(
            @RequestParam String userId,
            @RequestParam String productId,
            @RequestParam String size,
            @RequestParam int quantity) {
        try {
            cartService.updateCartItemQuantity(userId, productId, size, quantity);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Error-Message", "Failed to update quantity: " + e.getMessage())
                    .build();
        }
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeFromCart(
            @RequestParam String userId,
            @RequestParam String productId,
            @RequestParam String size) {
        try {
            cartService.removeFromCart(userId, productId, size);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Error-Message", e.getMessage())
                    .build();
        }
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCartItems(@RequestParam String userId) {
        try {
            List<CartItem> items = cartService.getCartItems(userId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Error-Message", e.getMessage())
                    .build();
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestParam String userId) {
        try {
            cartService.clearCart(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Error-Message", e.getMessage())
                    .build();
        }
    }

    @DeleteMapping("/remove-selected")
    public ResponseEntity<Void> removeSelectedItems(
            @RequestParam String userId,
            @RequestBody List<CartItem> selectedItems) {
        try {
            cartService.removeSelectedItems(userId, selectedItems);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Error-Message", "Failed to remove selected items: " + e.getMessage())
                    .build();
        }
    }
}