package com.example.ecommerce.repository;

import com.example.ecommerce.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReviewRepository extends MongoRepository<Review, String> {}