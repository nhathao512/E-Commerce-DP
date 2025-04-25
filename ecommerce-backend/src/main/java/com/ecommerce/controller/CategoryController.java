package com.ecommerce.controller;

import com.ecommerce.model.Category;
import com.ecommerce.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public Category addCategory(@RequestParam String name, @RequestParam String icon) {
        return categoryService.addCategory(name, icon);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PutMapping("/{id}")
    public Category updateCategory(
            @PathVariable String id,
            @RequestParam String name,
            @RequestParam String icon) {
        System.out.println("PUT /api/categories/" + id + " - name: " + name + ", icon: " + icon);
        return categoryService.updateCategory(id, name, icon);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
    }
}