package com.ecommerce.model;

public class CartItem {
    private Product product;
    private int quantity;
    private String size;
    private String productName; // Thêm trường này
    private double price; // Thêm trường này
    private String imageUrl; // Thêm trường này

    public CartItem() {}

    public CartItem(Product product, int quantity, String size) {
        this.product = product;
        this.quantity = quantity;
        this.size = size;
        this.productName = product.getName(); // Lưu tên sản phẩm
        this.price = product.getPrice(); // Lưu giá
        this.imageUrl = product.getImages() != null && !product.getImages().isEmpty()
                ? product.getImages().get(0) : null; // Lưu URL ảnh đầu tiên
    }

    public Product getProduct() { return product; }
    public void setProduct(Product product) {
        this.product = product;
        this.productName = product.getName();
        this.price = product.getPrice();
        this.imageUrl = product.getImages() != null && !product.getImages().isEmpty()
                ? product.getImages().get(0) : null;
    }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}