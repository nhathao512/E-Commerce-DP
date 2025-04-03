package com.example.ecommerce.service;

import org.springframework.stereotype.Service;

@Service
public class OrderService {
    public String processPayment(String method) {
        return "Thanh toán thành công qua " + method;
    }
}