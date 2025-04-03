package com.example.ecommerce.service;

import com.example.ecommerce.model.Review;
import com.example.ecommerce.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    public void addReview(Review review) {
        reviewRepository.save(review);
    }
}