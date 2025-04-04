package com.ecommerce.strategy;

public class BankTransferPayment implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Thanh toán " + amount + " qua chuyển khoản ngân hàng");
    }
}