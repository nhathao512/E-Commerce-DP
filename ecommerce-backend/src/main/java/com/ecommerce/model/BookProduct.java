package com.ecommerce.model;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")

public class BookProduct extends Product{
    private String author;

    public String getAuthor() {return  author;}
    public void setAuthor(String author) {this.author = author;}
}
