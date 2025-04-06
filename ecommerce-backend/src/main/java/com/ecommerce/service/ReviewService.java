package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.model.Review;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Review addReview(String productCode, String shortUserId, int rating, String comment) {
        if (productCode == null || productCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Product code cannot be empty");
        }
        if (shortUserId == null || shortUserId.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be empty");
        }
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        if (comment == null || comment.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment cannot be empty");
        }

        Optional<Product> productOptional = productRepository.findByProductCode(productCode);
        if (productOptional.isEmpty()) {
            throw new IllegalArgumentException("Product with code " + productCode + " does not exist");
        }

        Review review = new Review();
        review.setProductCode(productCode);
        review.setShortUserId(shortUserId);
        review.setRating(rating);
        review.setComment(comment);
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByProduct(String productCode) {
        if (productCode == null || productCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Product code cannot be empty");
        }
        List<Review> reviews = reviewRepository.findByProductCode(productCode);
        // Thêm username vào mỗi review
        for (Review review : reviews) {
            User user = userRepository.findByShortUserId(review.getShortUserId());
            if (user != null) {
                review.setUsername(user.getUsername()); // Giả sử bạn thêm setter này trong Review
            } else {
                review.setUsername("Anonymous"); // Trường hợp không tìm thấy user
            }
        }
        return reviews;
    }
}