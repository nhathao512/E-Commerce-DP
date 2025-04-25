package com.ecommerce.factory;

import com.ecommerce.model.ClothingProduct;
import com.ecommerce.model.Product;
import com.ecommerce.model.ShoeProduct;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class ProductFactory {
    private static final Random random = new Random();
    public static Product createProduct(String type, String name, Double price, 
                    String categoryId, String imageUrl, 
                    String description, Map<String, Integer> quantities, 
                    List<String> sizes, Map<String, Object> specificAttributes) {
        if (type.equalsIgnoreCase("clothing")) {
            ClothingProduct clothingProduct = new ClothingProduct();
            clothingProduct.setName(name);
            clothingProduct.setPrice(price);
            clothingProduct.setCategoryId(categoryId);
            clothingProduct.setQuantity(quantities);
            if(imageUrl != null) {
                clothingProduct.addImage(imageUrl);
            }
            clothingProduct.setDescription(description);
            clothingProduct.setMaterial((String) specificAttributes.get("material"));
            clothingProduct.setProductCode("CLO" + String.format("%03d", 
                                            random.nextInt(1000)));
            return clothingProduct;
        } else if (type.equalsIgnoreCase("shoe")) {
            ShoeProduct shoeProduct = new ShoeProduct();
            shoeProduct.setName(name);
            shoeProduct.setPrice(price);
            shoeProduct.setCategoryId(categoryId);
            shoeProduct.setQuantity(quantities);
            if(imageUrl != null) {
                shoeProduct.addImage(imageUrl);
            }
            shoeProduct.setDescription(description);
            shoeProduct.setSole((String) specificAttributes.get("sole"));
            shoeProduct.setProductCode("SHO" + String.format("%03d", 
                                            random.nextInt(1000)));
            return shoeProduct;
        } else {
            Product product = new Product() {
            };
            product.setName(name);
            product.setPrice(price);
            product.setCategoryId(categoryId);
            product.setQuantity(quantities);
            if(imageUrl != null) {
                product.addImage(imageUrl);
            }
            product.setDescription(description);
            return product;
        }
    }
}