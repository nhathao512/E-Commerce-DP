package com.ecommerce.controller;

import com.ecommerce.model.Order;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

//    @PostMapping("/create")
//    public ResponseEntity<Order> createOrder(
//            @RequestParam String userId,
//            @RequestParam String paymentMethod) {
//        Order order = orderService.createOrder(userId, paymentMethod);
//        return ResponseEntity.ok(order);
//    }
}