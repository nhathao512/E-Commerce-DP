package com.ecommerce.factory;

import com.ecommerce.model.ClothingProduct;
import com.ecommerce.model.ElectronicsProduct;
import com.ecommerce.model.Product;

public class ProductFactory {
    public static Product createProduct(String type, String name, double price, String categoryId, String extraAttribute, String imageUrl) {
        if ("electronics".equalsIgnoreCase(type)) {
            ElectronicsProduct product = new ElectronicsProduct();
            product.setName(name);
            product.setPrice(price);
            product.setCategoryId(categoryId);
            product.setWarranty(extraAttribute);
            product.setImageUrl(imageUrl);  // Thiết lập imageUrl
            return product;
        } else if ("clothing".equalsIgnoreCase(type)) {
            ClothingProduct product = new ClothingProduct();
            product.setName(name);
            product.setPrice(price);
            product.setCategoryId(categoryId);
            product.setSize(extraAttribute);
            product.setImageUrl(imageUrl);  // Thiết lập imageUrl
            return product;
        }
        throw new IllegalArgumentException("Loại sản phẩm không hợp lệ");
    }
}