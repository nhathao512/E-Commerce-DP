package com.ecommerce.service;

import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.observer.ConcreteCartObserver;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final Map<String, Cart> cartInstances = new HashMap<>();

    public Cart getCartInstance(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("ID người dùng không được trống!");
        }
        synchronized (cartInstances) {
            return cartInstances.computeIfAbsent(userId, k -> {
                Cart cart = new Cart(userId);
                // Đồng bộ dữ liệu từ MongoDB khi khởi tạo
                Optional<Cart> optionalCart = cartRepository.findById(userId);
                if (optionalCart.isPresent()) {
                    cart.setItems(optionalCart.get().getItems());
                }
                return cart;
            });
        }
    }

    public void removeCartInstance(String userId) {
        synchronized (cartInstances) {
            cartInstances.remove(userId);
        }
    }

    public void addToCart(String userId, Product product, int quantity, String size) {
        // Kiểm tra tồn kho
        Integer stockForSize = product.getQuantityForSize(size);
        if (stockForSize == null || stockForSize < quantity) {
            throw new IllegalArgumentException(
                    "Số lượng tồn kho không đủ! Chỉ còn " + (stockForSize != null ? stockForSize : 0) + " sản phẩm cho kích thước " + size
            );
        }

        // Lấy giỏ hàng
        Cart cart = getCartInstance(userId);

        // Đăng ký observer nếu chưa có
        boolean hasObserver = cart.getObservers().stream()
                .anyMatch(observer -> observer instanceof ConcreteCartObserver);
        if (!hasObserver) {
            cart.addObserver(new ConcreteCartObserver("UIObserver", userId, messagingTemplate));
        }

        // Thêm sản phẩm
        cart.addItem(product, quantity, size);
    }

    public void updateCartItemQuantity(String userId, String productId, String size, int quantity) {
        Optional<Product> optionalProduct = productRepository.findById(productId);
        if (!optionalProduct.isPresent()) {
            throw new IllegalArgumentException("Sản phẩm không tồn tại!");
        }
        Product product = optionalProduct.get();
        Integer stockForSize = product.getQuantityForSize(size);
        if (stockForSize == null || stockForSize < quantity) {
            throw new IllegalArgumentException(
                    "Số lượng tồn kho không đủ! Chỉ còn " + (stockForSize != null ? stockForSize : 0) + " sản phẩm cho kích thước " + size
            );
        }

        Cart cart = getCartInstance(userId);
        cart.updateItemQuantity(productId, size, quantity);
    }

    public boolean isProductInCart(String userId, String productId, String size) {
        Cart cart = getCartInstance(userId);
        return cart.getItems().stream()
                .anyMatch(item ->
                        item.getProduct().getId().equals(productId) &&
                                item.getSize().equals(size));
    }

    public List<CartItem> getCartItems(String userId) {
        Cart cart = getCartInstance(userId);
        return cart.getItems();
    }

    public void clearCart(String userId) {
        Cart cart = getCartInstance(userId);
        cart.clear();
    }

    public double getTotal(String userId) {
        Cart cart = getCartInstance(userId);
        return cart.getTotal();
    }

    public void removeSelectedItems(String userId, List<CartItem> selectedItems) {
        Cart cart = getCartInstance(userId);
        boolean hasObserver = cart.getObservers().stream()
                .anyMatch(observer -> observer instanceof ConcreteCartObserver);
        if (!hasObserver) {
            cart.addObserver(new ConcreteCartObserver("UIObserver", userId, messagingTemplate));
        }

        for (CartItem item : selectedItems) {
            cart.removeItem(item.getProduct().getId(), item.getSize());
        }
    }

    public void removeFromCart(String userId, String productId, String size) {
        Cart cart = getCartInstance(userId);
        // Đăng ký observer nếu chưa có
        boolean hasObserver = cart.getObservers().stream()
                .anyMatch(observer -> observer instanceof ConcreteCartObserver);
        if (!hasObserver) {
            cart.addObserver(new ConcreteCartObserver("UIObserver", userId, messagingTemplate));
        }

        cart.removeItem(productId, size);
    }
}