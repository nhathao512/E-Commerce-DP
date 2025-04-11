package com.ecommerce.factory;

import com.ecommerce.model.Product;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class ProductFactory {
    private static final Random random = new Random();

    public static Product createProduct(String type, String name, Double price, String categoryId,
                                        String imageUrl, String description, Map<String, Integer> quantities, List<String> sizes) {
        // Create a generic Product instance
        Product product = new Product() {
            // Anonymous subclass to satisfy abstract class instantiation
        };

        // Set common attributes
        product.setName(name);
        product.setPrice(price);
        product.setCategoryId(categoryId);
        if (imageUrl != null && !imageUrl.isEmpty()) {
            product.addImage(imageUrl);
        }
        product.setDescription(description);

        // Set sizes if provided
        if (sizes != null) {
            product.setSizes(sizes);
        }

        // Set quantities if provided
        if (quantities != null) {
            product.setQuantity(quantities);
        } else {
            // Default to empty quantity map if none provided
            product.setQuantity(new HashMap<>());
        }

        // Generate product code based on type
        String productCodePrefix = getProductCodePrefix(type.toLowerCase());
        String productCode = productCodePrefix + String.format("%03d", random.nextInt(1000));
        product.setProductCode(productCode);

        return product;
    }

    private static String getProductCodePrefix(String type) {
        switch (type.toLowerCase()) {
            case "shoe":
                return "SHO";
            case "clothing":
                return "CLO";
            default:
                throw new IllegalArgumentException("Invalid product type: " + type);
        }
    }
}