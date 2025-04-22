package com.ecommerce.service;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.factory.ProductFactory;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.ClothingProduct;
import com.ecommerce.model.Product;
import com.ecommerce.model.ShoeProduct;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public Product addProduct(ProductRequest request) {
        Map<String, Object> specificAttributes = new HashMap<>();
        if ("clothing".equalsIgnoreCase(request.getType())) {
            specificAttributes.put("material", request.getMaterial());
        } else if ("shoe".equalsIgnoreCase(request.getType())) {
            specificAttributes.put("sole", request.getSole());
        }

        Product product = ProductFactory.createProduct(
                request.getType(),
                request.getName(),
                request.getPrice(),
                request.getCategoryId(),
                request.getImageUrl(),
                request.getDescription(),
                request.getQuantity(),
                request.getSizes(),
                specificAttributes
        );
        return productRepository.save(product);
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Product getProductByProductCode(String productCode) {
        return productRepository.findByProductCode(productCode)
                .orElseThrow(() -> new RuntimeException("Product not found with productCode: " + productCode));
    }

    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getProductsByCategory(String categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public void updateProductQuantity(List<CartItem> items) {
        for (CartItem item : items) {
            String productId = item.getProduct().getId();
            String size = item.getSize();
            int quantity = item.getQuantity();
            Optional<Product> optionalProduct = productRepository.findById(productId);
            if (!optionalProduct.isPresent()) {
                throw new IllegalArgumentException("Sản phẩm không tồn tại với ID: " + productId);
            }
            Product product = optionalProduct.get();

            Integer currentQuantity = product.getQuantityForSize(size);
            if (currentQuantity == null || currentQuantity < quantity) {
                throw new IllegalArgumentException(
                        "Số lượng tồn kho không đủ cho kích thước " + size + "! Chỉ còn " +
                                (currentQuantity != null ? currentQuantity : 0)
                );
            }

            product.updateQuantity(size, currentQuantity - quantity);
            productRepository.save(product);
        }
    }

    public void refundProductQuantity(List<CartItem> items) {
        for (CartItem item : items) {
            String productId = item.getProduct().getId();
            String size = item.getSize();
            int quantity = item.getQuantity();
            Optional<Product> optionalProduct = productRepository.findById(productId);
            if (!optionalProduct.isPresent()) {
                throw new IllegalArgumentException("Sản phẩm không tồn tại với ID: " + productId);
            }
            Product product = optionalProduct.get();

            Integer currentQuantity = product.getQuantityForSize(size);

            product.updateQuantity(size, currentQuantity + quantity);
            productRepository.save(product);
        }

    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public void deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    public void deleteImage(Product product, String imageName) {
        // Kiểm tra xem hình ảnh có tồn tại trong danh sách không
        List<String> images = product.getImages();
        if (!images.contains(imageName)) {
            throw new IllegalArgumentException("Hình ảnh không tồn tại trong sản phẩm");
        }

        // Xóa hình ảnh khỏi danh sách
        images.remove(imageName);
        product.setImages(images);

        // Cập nhật sản phẩm
        productRepository.save(product);

        try {
            // Xóa file vật lý nếu cần
            java.nio.file.Path imagePath = Paths.get(System.getProperty("user.dir") + "/uploads/products/" + imageName);
            java.nio.file.Files.deleteIfExists(imagePath);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi xóa file hình ảnh: " + e.getMessage());
        }
    }
}