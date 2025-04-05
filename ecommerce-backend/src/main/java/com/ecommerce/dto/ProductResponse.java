package com.ecommerce.dto;

import com.ecommerce.model.ClothingProduct;
import com.ecommerce.model.ElectronicsProduct;
import com.ecommerce.model.Product;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductResponse {
    private String id;
    private String name;
    private String description;
    private double price;
    private String imageUrl; // Đổi tên thành imageUrl để thống nhất
    private String categoryId;
    private int quantity;
    private String extraAttribute; // Tùy thuộc vào loại sản phẩm

    public ProductResponse(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.imageUrl = product.getImage(); // getImage() trả về String, khớp với imageUrl
        this.categoryId = product.getCategoryId();
        this.quantity = product.getQuantity();

        // Xử lý extraAttribute dựa trên loại sản phẩm
        if (product instanceof ElectronicsProduct) {
            this.extraAttribute = ((ElectronicsProduct) product).getWarranty();
        } else if (product instanceof ClothingProduct) {
            this.extraAttribute = ((ClothingProduct) product).getSize();
        }
    }
}