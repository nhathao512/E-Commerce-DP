package com.ecommerce.factory;

import com.ecommerce.model.*;

import java.util.Random;

public class ProductFactory {
    private static final Random random = new Random();

    public static Product createProduct(String type, String name, double price, String categoryId,
                                        String imageUrl, String description, int quantity,
                                        String... extraAttributes) {
        Product product;
        String productCodePrefix;

        switch (type.toLowerCase()) {
            case "electronics":
                product = new ElectronicsProduct();
                if (extraAttributes.length > 0) {
                    ((ElectronicsProduct) product).setWarranty(extraAttributes[0]);
                }
                productCodePrefix = "ELE";
                break;
            case "clothing":
                product = new ClothingProduct();
                if (extraAttributes.length > 0) {
                    ((ClothingProduct) product).setSize(extraAttributes[0]); // Size
                }
                if (extraAttributes.length > 1) {
                    ((ClothingProduct) product).setColor(extraAttributes[1]); // Color
                }
                productCodePrefix = "CLO";
                break;
            case "household":
                product = new HouseholdProduct();
                if (extraAttributes.length > 0) {
                    ((HouseholdProduct) product).setBrand(extraAttributes[0]);
                }
                productCodePrefix = "HO";
                break;
            case "book":
                product = new BookProduct();
                if (extraAttributes.length > 0) {
                    ((BookProduct) product).setAuthor(extraAttributes[0]);
                }
                productCodePrefix = "BO";
                break;
            default:
                throw new IllegalArgumentException("Invalid product type: " + type);
        }

        product.setName(name);
        product.setPrice(price);
        product.setCategoryId(categoryId);
        if (imageUrl != null && !imageUrl.isEmpty()) {
            product.addImage(imageUrl);
        }
        product.setDescription(description);
        product.setQuantity(quantity);

        String productCode = productCodePrefix + String.format("%03d", random.nextInt(1000));
        product.setProductCode(productCode);

        return product;
    }
}