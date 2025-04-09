package com.ecommerce.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "reviews")
public class Review {
    @Id
    private String id;
    private String productCode;
    private String shortUserId;
    private int rating;
    private String comment;
    private Date date;
    private String username;
    private String fullName;

    public Review() {
        this.date = new Date();
    }

    // Getters và Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public String getShortUserId() { return shortUserId; }
    public void setShortUserId(String shortUserId) { this.shortUserId = shortUserId; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; } // Thêm setter

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
}