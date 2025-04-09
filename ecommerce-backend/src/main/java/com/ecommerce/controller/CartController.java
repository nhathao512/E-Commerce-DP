package com.ecommerce.controller;

import com.ecommerce.model.*;
import com.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<Void> addToCart(@RequestBody Product product, @RequestParam(name = "quantity", defaultValue = "1") int quantity) {
        String productID = product.getId();

        if(cartService.isProductInCart(productID)){
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .header("Error-Message", "Product already exists in cart")
                    .build();
        }

        if(product instanceof ClothingProduct){
            cartService.addToCart((ClothingProduct) product, quantity);
        } else if(product instanceof ElectronicsProduct){
            cartService.addToCart((ElectronicsProduct) product, quantity);
        } else if(product instanceof  BookProduct){
            cartService.addToCart((BookProduct) product, quantity);
        } else if(product instanceof HouseholdProduct){
            cartService.addToCart((HouseholdProduct) product, quantity);
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