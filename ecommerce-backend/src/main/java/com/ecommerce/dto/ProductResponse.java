package com.ecommerce.dto;

import com.ecommerce.model.ClothingProduct;
import com.ecommerce.model.ElectronicsProduct;
import com.ecommerce.model.Product;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductResponse {
    // Getters và Setters
    private String id;
    private String name;
    private double price;
    private String categoryId;
    private String extraAttribute;
    private String imageUrl;  // Thêm imageUrl

    public ProductResponse(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.price = product.getPrice();
        this.categoryId = product.getCategoryId();
        this.imageUrl = product.getImageUrl();
        if (product instanceof ElectronicsProduct) {
            this.extraAttribute = ((ElectronicsProduct) product).getWarranty();
        } else if (product instanceof ClothingProduct) {
            this.extraAttribute = ((ClothingProduct) product).getSize();
        }
    }

}