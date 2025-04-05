package com.ecommerce.factory;

import com.ecommerce.model.ClothingProduct;
import com.ecommerce.model.ElectronicsProduct;
import com.ecommerce.model.Product;

public class ProductFactory {
    public static Product createProduct(String type, String name, double price, String categoryId, String imageUrl, String description, int quantity) {
        Product product;
        switch (type.toLowerCase()) {
            case "electronics":
                product = new ElectronicsProduct();
                ((ElectronicsProduct) product).setWarranty(description); // Giả sử description là warranty
                break;
            case "clothing":
                product = new ClothingProduct();
                ((ClothingProduct) product).setSize(description); // Giả sử description là size
                break;
            default:
                throw new IllegalArgumentException("Invalid product type: " + type);
        }
        product.setName(name);
        product.setPrice(price);
        product.setCategoryId(categoryId);
        product.setImage(imageUrl);
        product.setDescription(description);
        product.setQuantity(quantity);
        return product;
    }
}