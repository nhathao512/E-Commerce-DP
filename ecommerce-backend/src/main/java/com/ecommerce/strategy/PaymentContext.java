package com.ecommerce.strategy;

public class PaymentContext {
    private PaymentStrategy strategy;

    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.strategy = strategy;
    }

    public void executePayment(double amount) {
        if (strategy != null) {
            strategy.pay(amount);
        } else {
            throw new IllegalStateException("Chưa chọn phương thức thanh toán");
        }
    }
}