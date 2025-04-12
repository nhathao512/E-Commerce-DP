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
            @RequestParam String userId) { // Hoặc lấy từ SecurityContext
        String productId = product.getId();

        if (cartService.isProductInCart(userId, productId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .header("Error-Message", "Product already exists in cart")
                    .build();
        }

        if (product instanceof ClothingProduct || product instanceof ShoeProduct) {
            cartService.addToCart(userId, product, quantity, size);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .header("Error-Message", "Invalid product type")
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
}