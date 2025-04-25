package com.ecommerce.service;

import com.ecommerce.model.CartItem;
import com.ecommerce.model.Order;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.strategy.BankTransferPayment;
import com.ecommerce.strategy.CreditCardPayment;
import com.ecommerce.strategy.PaymentContext;
import com.ecommerce.strategy.WalletPayment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    private static final List<String> VALID_STATUSES = Arrays.asList(
            "Xác nhận", "Đang xử lý", "Giao hàng", "Hoàn thành", "Hủy", "Trả hàng"
    );

    public Order createOrder(String userId, List<CartItem> items, String paymentMethod, double total,
                             String name, String phone, String address, String voucher,
                             String transferCode, String cardNumber, String cardExpiry, String cardCVC) {
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Danh sách sản phẩm không được trống!");
        }
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("ID người dùng không được trống!");
        }

        for (CartItem item : items) {
            if (item.getProduct() == null || item.getProduct().getProductCode() == null) {
                throw new IllegalArgumentException("Sản phẩm hoặc mã sản phẩm không hợp lệ: " + item.getProductName());
            }
            item.setProductCode(item.getProduct().getProductCode());
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setItems(items);
        order.setTotal(total);
        order.setPaymentMethod(paymentMethod);
        order.setName(name);
        order.setPhone(phone);
        order.setAddress(address);
        order.setVoucher(voucher);
        order.setTransferCode(transferCode);
        order.setCardNumber(cardNumber);
        order.setCardExpiry(cardExpiry);
        order.setCardCVC(cardCVC);
        order.setStatus("Đang xử lý");

        PaymentContext paymentContext = new PaymentContext();
        switch (paymentMethod.toLowerCase()) {
            case "cod":
                paymentContext.setPaymentStrategy(new WalletPayment());
                break;
            case "bank":
                paymentContext.setPaymentStrategy(new BankTransferPayment());
                break;
            case "credit":
                paymentContext.setPaymentStrategy(new CreditCardPayment());
                break;
            default:
                throw new IllegalArgumentException("Phương thức thanh toán không hợp lệ: " + paymentMethod);
        }
        paymentContext.executePayment(total);

        Order savedOrder = orderRepository.save(order);
        productService.updateProductQuantity(items);
        cartService.removeSelectedItems(userId, items);
        return savedOrder;
    }

    public List<Order> getOrdersByUserId(String userId) {
        if (userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("ID người dùng không được trống!");
        }
        List<Order> orders = orderRepository.findByUserId(userId);
        for (Order order : orders) {
            for (CartItem item : order.getItems()) {
                if (item.getProductCode() == null || item.getProductCode().isEmpty()) {
                    if (item.getProduct() != null && item.getProduct().getProductCode() != null) {
                        item.setProductCode(item.getProduct().getProductCode());
                    } else {
                        item.setProductCode("UNKNOWN");
                    }
                }
            }
        }
        return orders;
    }

    public List<Order> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        for (Order order : orders) {
            for (CartItem item : order.getItems()) {
                if (item.getProductCode() == null || item.getProductCode().isEmpty()) {
                    if (item.getProduct() != null && item.getProduct().getProductCode() != null) {
                        item.setProductCode(item.getProduct().getProductCode());
                    } else {
                        item.setProductCode("UNKNOWN");
                    }
                }
            }
        }
        return orders;
    }

    public Order updateOrder(String id, Order updatedOrder) {
        Optional<Order> existingOrderOpt = orderRepository.findById(id);
        if (!existingOrderOpt.isPresent()) {
            throw new IllegalArgumentException("Đơn hàng không tồn tại!");
        }
        Order existingOrder = existingOrderOpt.get();
        existingOrder.setUserId(updatedOrder.getUserId());
        existingOrder.setItems(updatedOrder.getItems());
        existingOrder.setTotal(updatedOrder.getTotal());
        existingOrder.setPaymentMethod(updatedOrder.getPaymentMethod());
        existingOrder.setStatus(updatedOrder.getStatus());
        existingOrder.setName(updatedOrder.getName());
        existingOrder.setPhone(updatedOrder.getPhone());
        existingOrder.setAddress(updatedOrder.getAddress());
        existingOrder.setTransferCode(updatedOrder.getTransferCode());
        existingOrder.setCardNumber(updatedOrder.getCardNumber());
        existingOrder.setCardExpiry(updatedOrder.getCardExpiry());
        existingOrder.setCardCVC(updatedOrder.getCardCVC());
        existingOrder.setCancelReason(updatedOrder.getCancelReason());
        return orderRepository.save(existingOrder);
    }

    public Order updateOrderStatus(String id, String status, String cancelReason) {
        Optional<Order> existingOrderOpt = orderRepository.findById(id);
        if (!existingOrderOpt.isPresent()) {
            throw new IllegalArgumentException("Đơn hàng không tồn tại!");
        }
        if (!VALID_STATUSES.contains(status)) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + status);
        }
        Order existingOrder = existingOrderOpt.get();
        existingOrder.setStatus(status);
        if (status.equals("Hủy") && cancelReason != null && !cancelReason.isEmpty()) {
            productService.refundProductQuantity(existingOrder.getItems());
            existingOrder.setCancelReason(cancelReason);
        } else if (status.equals("Hủy")) {
            productService.refundProductQuantity(existingOrder.getItems());
        } else if (!status.equals("Hủy")) {
            existingOrder.setCancelReason(null);
        }
        return orderRepository.save(existingOrder);
    }

    public void deleteOrder(String id) {
        if (!orderRepository.existsById(id)) {
            throw new IllegalArgumentException("Đơn hàng không tồn tại!");
        }
        orderRepository.deleteById(id);
    }
}