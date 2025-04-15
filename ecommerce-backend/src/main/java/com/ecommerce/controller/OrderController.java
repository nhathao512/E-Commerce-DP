package com.ecommerce.controller;

import com.ecommerce.model.Order;
import com.ecommerce.model.CartItem;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(
            @RequestBody List<CartItem> items,
            @RequestParam String userId,
            @RequestParam String paymentMethod,
            @RequestParam double total,
            @RequestParam String name,
            @RequestParam String phone,
            @RequestParam String address,
            @RequestParam(required = false) String voucher,
            @RequestParam(required = false) String transferCode,
            @RequestParam(required = false) String cardNumber,
            @RequestParam(required = false) String cardExpiry,
            @RequestParam(required = false) String cardCVC) {
        Order order = orderService.createOrder(
                userId, items, paymentMethod, total, name, phone, address,
                voucher, transferCode, cardNumber, cardExpiry, cardCVC
        );
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable String userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    // Thêm endpoint để lấy tất cả đơn hàng
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // Thêm endpoint để cập nhật đơn hàng
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(
            @PathVariable String id,
            @RequestBody Order updatedOrder) {
        Order order = orderService.updateOrder(id, updatedOrder);
        return ResponseEntity.ok(order);
    }

    // Thêm endpoint để xóa đơn hàng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}