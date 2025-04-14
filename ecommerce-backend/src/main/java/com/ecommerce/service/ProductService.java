package com.ecommerce.service;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.factory.ProductFactory;
import com.ecommerce.model.ClothingProduct;
import com.ecommerce.model.Product;
import com.ecommerce.model.ShoeProduct;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public Product addProduct(ProductRequest request) {
        // Tạo sản phẩm bằng ProductFactory
        Product tempProduct = ProductFactory.createProduct(
                request.getType(),
                request.getName(),
                request.getPrice(),
                request.getCategoryId(),
                request.getImageUrl(),
                request.getDescription(),
                request.getQuantity(),
                request.getSizes()
        );

        // Nếu type là clothing, tạo instance ClothingProduct và sao chép thuộc tính
        switch (request.getType().toLowerCase()){
            case "clothing":
                ClothingProduct clothingProduct = new ClothingProduct();
                clothingProduct.setName(tempProduct.getName());
                clothingProduct.setPrice(tempProduct.getPrice());
                clothingProduct.setCategoryId(tempProduct.getCategoryId());
                clothingProduct.setImages(tempProduct.getImages());
                clothingProduct.setDescription(tempProduct.getDescription());
                clothingProduct.setSizes(tempProduct.getSizes());
                clothingProduct.setQuantity(tempProduct.getQuantity());
                clothingProduct.setProductCode(tempProduct.getProductCode());
                clothingProduct.setMaterial(request.getMaterial());
                return productRepository.save(clothingProduct);
            case "shoe":
                ShoeProduct shoeProduct = new ShoeProduct();
                shoeProduct.setName(tempProduct.getName());
                shoeProduct.setPrice(tempProduct.getPrice());
                shoeProduct.setCategoryId(tempProduct.getCategoryId());
                shoeProduct.setImages(tempProduct.getImages());
                shoeProduct.setDescription(tempProduct.getDescription());
                shoeProduct.setSizes(tempProduct.getSizes());
                shoeProduct.setQuantity(tempProduct.getQuantity());
                shoeProduct.setProductCode(tempProduct.getProductCode());
                shoeProduct.setSole(request.getSole());
                return productRepository.save(shoeProduct);
            default:
                return productRepository.save(tempProduct);
        }
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Product getProductByProductCode(String productCode) {
        return productRepository.findByProductCode(productCode)
                .orElseThrow(() -> new RuntimeException("Product not found with productCode: " + productCode));
    }

    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getProductsByCategory(String categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public void deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    public void deleteImage(Product product, String imageName) {
        // Kiểm tra xem hình ảnh có tồn tại trong danh sách không
        List<String> images = product.getImages();
        if (!images.contains(imageName)) {
            throw new IllegalArgumentException("Hình ảnh không tồn tại trong sản phẩm");
        }

        // Xóa hình ảnh khỏi danh sách
        images.remove(imageName);
        product.setImages(images);

        // Cập nhật sản phẩm
        productRepository.save(product);

        try {
            // Xóa file vật lý nếu cần
            java.nio.file.Path imagePath = Paths.get(System.getProperty("user.dir") + "/uploads/products/" + imageName);
            java.nio.file.Files.deleteIfExists(imagePath);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi xóa file hình ảnh: " + e.getMessage());
        }
    }
}