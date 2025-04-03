package com.example.ecommerce.repository;

import com.example.ecommerce.model.CartItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CartRepository extends MongoRepository<CartItem, String> {}