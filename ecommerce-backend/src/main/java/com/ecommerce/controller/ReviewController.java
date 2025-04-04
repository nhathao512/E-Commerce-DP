package com.ecommerce.controller;

import com.ecommerce.model.Review;
import com.ecommerce.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public Review addReview(@RequestParam String productId, @RequestParam String userId,
                            @RequestParam int rating, @RequestParam String comment) {
        return reviewService.addReview(productId, userId, rating, comment);
    }

    @GetMapping("/product/{productId}")
    public List<Review> getReviewsByProduct(@PathVariable String productId) {
        return reviewService.getReviewsByProduct(productId);
    }
}