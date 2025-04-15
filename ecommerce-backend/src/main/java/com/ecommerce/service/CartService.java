package com.ecommerce.service;

import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    public void addToCart(String userId, Product product, int quantity, String size) {
        // Kiểm tra tồn kho
        Integer stockForSize = product.getQuantityForSize(size);
        if (stockForSize == null || stockForSize < quantity) {
            throw new IllegalArgumentException(
                    "Số lượng tồn kho không đủ! Chỉ còn " + (stockForSize != null ? stockForSize : 0) + " sản phẩm cho kích thước " + size
            );
        }

        // Lấy giỏ hàng từ Singleton
        Cart cart = Cart.getInstance(userId);

        // Đồng bộ dữ liệu từ MongoDB khi khởi tạo
        Optional<Cart> optionalCart = cartRepository.findById(userId);
        if (optionalCart.isPresent() && cart.getItems().isEmpty()) {
            cart.setItems(optionalCart.get().getItems());
        }

        // Thêm sản phẩm
        cart.addItem(product, quantity, size);

        // Lưu giỏ hàng
        cartRepository.save(cart);
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

        Cart cart = Cart.getInstance(userId);
        cart.updateItemQuantity(productId, size, quantity);
        cartRepository.save(cart);
    }

    public boolean isProductInCart(String userId, String productId, String size) {
        Cart cart = Cart.getInstance(userId);
        return cart.getItems().stream()
                .anyMatch(item ->
                        item.getProduct().getId().equals(productId) &&
                                item.getSize().equals(size));
    }

    public List<CartItem> getCartItems(String userId) {
        Cart cart = Cart.getInstance(userId);
        Optional<Cart> optionalCart = cartRepository.findById(userId);
        if (optionalCart.isPresent() && cart.getItems().isEmpty()) {
            cart.setItems(optionalCart.get().getItems());
        }
        return cart.getItems();
    }

    public void clearCart(String userId) {
        Cart cart = Cart.getInstance(userId);
        cart.clear();
        cartRepository.save(cart);
    }

    public double getTotal(String userId) {
        Cart cart = Cart.getInstance(userId);
        return cart.getTotal();
    }

    public boolean removeFromCart(String userId, String productId, String size) {
        Cart cart = Cart.getInstance(userId);
        boolean removed = cart.removeItem(productId, size);
        cartRepository.save(cart);
        return removed;
    }
}