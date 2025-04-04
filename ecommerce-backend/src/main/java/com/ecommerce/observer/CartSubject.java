package com.ecommerce.observer;

import com.ecommerce.model.Product;
import java.util.ArrayList;
import java.util.List;

public class CartSubject {
    private List<CartObserver> observers = new ArrayList<>();
    private int itemCount;

    public void addObserver(CartObserver observer) {
        observers.add(observer);
    }

    public void addProduct(Product product) {
        itemCount++;
        notifyObservers();
    }

    private void notifyObservers() {
        for (CartObserver observer : observers) {
            observer.update(itemCount);
        }
    }
}

//package com.ecommerce.observer;
//
//public class CartUIObserver implements CartObserver {
//    @Override
//    public void update(int itemCount) {
//        System.out.println("Cập nhật giao diện: Số lượng sản phẩm trong giỏ hàng: " + itemCount);
//        // Logic cập nhật UI ở đây (trong thực tế sẽ gửi thông báo tới frontend)
//    }
//}