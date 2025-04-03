package com.example.ecommerce.controller;

import com.example.ecommerce.model.Review;
import com.example.ecommerce.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PostMapping("/reviews")
    public String addReview(@RequestBody Review review) {
        reviewService.addReview(review);
        return "Đánh giá thành công";
    }
}