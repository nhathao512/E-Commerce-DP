package com.ecommerce.model;

public class CartItem {
    private Product product;
    private int quantity;
    private String size;
    private String productName;
    private double price;
    private String imageUrl;
    private String productCode; // Thêm trường productCode

    public CartItem() {}

    public CartItem(Product product, int quantity, String size) {
        this.product = product;
        this.quantity = quantity;
        this.size = size;
        this.productName = product.getName();
        this.price = product.getPrice();
        this.imageUrl = product.getImages() != null && !product.getImages().isEmpty()
                ? product.getImages().get(0) : null;
        this.productCode = product.getProductCode(); // Gán productCode từ Product
    }

    public Product getProduct() { return product; }
    public void setProduct(Product product) {
        this.product = product;
        this.productName = product.getName();
        this.price = product.getPrice();
        this.imageUrl = product.getImages() != null && !product.getImages().isEmpty()
                ? product.getImages().get(0) : null;
        this.productCode = product.getProductCode();
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

    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
}