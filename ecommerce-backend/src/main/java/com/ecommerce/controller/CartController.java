package com.ecommerce.controller;

import com.ecommerce.model.Product;
import com.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public void addToCart(@RequestBody Product product) {
        cartService.addToCart(product);
    }

    @GetMapping
    public List<Product> getCartItems() {
        return cartService.getCartItems();
    }
}