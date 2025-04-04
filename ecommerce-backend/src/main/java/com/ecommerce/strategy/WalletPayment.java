package com.ecommerce.strategy;

public class WalletPayment implements PaymentStrategy {
    @Override
    public void pay(double amount) {
        System.out.println("Thanh toán " + amount + " qua ví điện tử");
    }
}