package com.ecommerce.repository;

import com.ecommerce.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategoryId(String categoryId);
    Optional<Product> findByProductCode(String productCode);

}