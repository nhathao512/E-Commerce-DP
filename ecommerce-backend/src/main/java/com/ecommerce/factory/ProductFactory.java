package com.ecommerce.factory;

import com.ecommerce.model.ClothingProduct;
import com.ecommerce.model.ElectronicsProduct;
import com.ecommerce.model.BookProduct;
import com.ecommerce.model.HouseholdProduct;
import com.ecommerce.model.Product;

import java.util.Random;

public class ProductFactory {
    private static final Random random = new Random();

    public static Product createProduct(String type, String name, double price,
                                        String categoryId, String imageUrl, String description, int quantity) {
        Product product;
        String productCodePrefix;
        switch (type.toLowerCase()) {
            case "electronics":
                product = new ElectronicsProduct();
                ((ElectronicsProduct) product).setWarranty(description);
                productCodePrefix = "ELE";
                break;
            case "clothing":
                product = new ClothingProduct();
                ((ClothingProduct) product).setSize(description);
                productCodePrefix = "CLO";
                break;
            case "household":
                product = new HouseholdProduct();
                ((HouseholdProduct) product).setBrand(description);
                productCodePrefix = "HO";
                break;
            case "book":
                product = new BookProduct();
                ((BookProduct) product).setAuthor(description);
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

        // Sinh productCode: ví dụ ELE001, CLO002
        String productCode = productCodePrefix + String.format("%03d", random.nextInt(1000));
        product.setProductCode(productCode);

        return product;
    }
}