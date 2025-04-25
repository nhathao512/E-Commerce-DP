package com.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String userId;
    private List<CartItem> items;
    private double total;
    private String paymentMethod;
    private String name;
    private String phone;
    private String address;
    private String voucher;
    private String transferCode;
    private String cardNumber;
    private String cardExpiry;
    private String cardCVC;
    private String status;
    private String cancelReason;
    private Date createdAt;

    public Order() {
        this.createdAt = new Date();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }
    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getVoucher() { return voucher; }
    public void setVoucher(String voucher) { this.voucher = voucher; }
    public String getTransferCode() { return transferCode; }
    public void setTransferCode(String transferCode) { this.transferCode = transferCode; }
    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }
    public String getCardExpiry() { return cardExpiry; }
    public void setCardExpiry(String cardExpiry) { this.cardExpiry = cardExpiry; }
    public String getCardCVC() { return cardCVC; }
    public void setCardCVC(String cardCVC) { this.cardCVC = cardCVC; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCancelReason() { return cancelReason; }
    public void setCancelReason(String cancelReason) { this.cancelReason = cancelReason; }
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}