package com.ecommerce.service;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.factory.ProductFactory;
import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public Product addProduct(ProductRequest request) {
        Product product = ProductFactory.createProduct(
                request.getType(),
                request.getName(),
                request.getPrice(),
                request.getCategoryId(),
                request.getImageUrl(),
                request.getDescription(),
                request.getQuantity()
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

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}