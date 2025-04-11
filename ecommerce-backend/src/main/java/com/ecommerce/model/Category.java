package com.ecommerce.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection = "categories")
public class Category {
    @Id
    @JsonProperty("id") // Đảm bảo ánh xạ _id từ MongoDB thành id trong JSON
    private String id;

    @JsonProperty("name") // Rõ ràng ánh xạ trường name
    private String name;

    @JsonProperty("icon") // Rõ ràng ánh xạ trường icon
    private String icon;

    public Category() {}
    public Category(String name, String icon) {
        this.name = name;
        this.icon = icon;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}