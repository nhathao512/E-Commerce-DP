package com.ecommerce.controller;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;



@RestController
@RequestMapping("/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    // Endpoint thêm sản phẩm (chỉ nhận JSON)
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseObject> addProduct(@RequestBody ProductRequest request) {
        Product product = productService.addProduct(request);
        return ResponseEntity.ok(ResponseObject.builder()
                .message("Create new product successfully")
                .status(HttpStatus.CREATED)
                .data(new ProductResponse(product))
                .build());
    }

    // Endpoint upload hình ảnh cho sản phẩm đã tạo
    @PostMapping(value = "/uploads/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject> uploadImages(
            @PathVariable("id") String productId,
            @RequestParam("image") List<MultipartFile> files) {
        try {
            Product existingProduct = productService.getProductById(productId);
            if (files == null || files.isEmpty()) {
                return ResponseEntity.badRequest().body(ResponseObject.builder()
                        .message("No images uploaded")
                        .status(HttpStatus.BAD_REQUEST)
                        .build());
            }

            final int MAXIMUM_IMAGES_PER_PRODUCT = 5;
            if (files.size() > MAXIMUM_IMAGES_PER_PRODUCT) {
                return ResponseEntity.badRequest().body(ResponseObject.builder()
                        .message("Maximum " + MAXIMUM_IMAGES_PER_PRODUCT + " images allowed")
                        .status(HttpStatus.BAD_REQUEST)
                        .build());
            }

            for (MultipartFile file : files) {
                if (file.getSize() == 0) {
                    continue;
                }

                if (file.getSize() > 10 * 1024 * 1024) {
                    return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(ResponseObject.builder()
                            .message("File size exceeds 10MB")
                            .status(HttpStatus.PAYLOAD_TOO_LARGE)
                            .build());
                }

                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(ResponseObject.builder()
                            .message("File must be an image")
                            .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                            .build());
                }

                String imageUrl = saveImage(file);
                existingProduct.setImage(imageUrl); // Sử dụng setImage thay vì setImageUrl
                productService.updateProduct(existingProduct);
            }

            return ResponseEntity.ok(ResponseObject.builder()
                    .message("Upload images successfully")
                    .status(HttpStatus.OK)
                    .data(new ProductResponse(existingProduct))
                    .build());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseObject.builder()
                    .message("Error uploading images: " + e.getMessage())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build());
        }
    }

    private String saveImage(MultipartFile image) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        String uploadDir = "src/main/resources/static/images/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
        File destination = new File(uploadDir + fileName);
        image.transferTo(destination);
        return "/images/" + fileName;
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<ProductResponse> responses = products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable String categoryId) {
        List<Product> products = productService.getProductsByCategory(categoryId);
        List<ProductResponse> responses = products.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}