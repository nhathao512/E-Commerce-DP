package com.ecommerce.service;

import com.ecommerce.model.Order;
import com.ecommerce.model.Product;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.strategy.PaymentContext;
import com.ecommerce.strategy.BankTransferPayment;
import com.ecommerce.strategy.WalletPayment;
import com.ecommerce.strategy.CreditCardPayment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    public Order createOrder(String userId, String paymentMethod) {
        List<Product> items = cartService.getCartItems();
        if (items.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        double total = cartService.getTotal();
        Order order = new Order();
        order.setUserId(userId);
        order.setItems(items);
        order.setTotal(total);
        order.setPaymentMethod(paymentMethod);

        // Xử lý thanh toán với Strategy Pattern
        PaymentContext paymentContext = new PaymentContext();
        switch (paymentMethod.toLowerCase()) {
            case "bank_transfer":
                paymentContext.setPaymentStrategy(new BankTransferPayment());
                break;
            case "wallet":
                paymentContext.setPaymentStrategy(new WalletPayment());
                break;
            case "credit_card":
                paymentContext.setPaymentStrategy(new CreditCardPayment());
                break;
            default:
                throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ");
        }
        paymentContext.executePayment(total);

        cartService.clearCart();
        return orderRepository.save(order);
    }
}