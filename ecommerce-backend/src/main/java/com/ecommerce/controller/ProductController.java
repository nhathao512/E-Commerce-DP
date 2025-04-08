package com.ecommerce.controller;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseObject> addProduct(@RequestBody ProductRequest request) {
        try {
            Product product = productService.addProduct(request);
            return ResponseEntity.ok(ResponseObject.builder()
                    .message("Tạo sản phẩm mới thành công")
                    .status(HttpStatus.CREATED)
                    .data(new ProductResponse(product))
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ResponseObject.builder()
                    .message("Error creating product: " + e.getMessage())
                    .status(HttpStatus.BAD_REQUEST)
                    .build());
        }
    }

    @PostMapping(value = "/uploads", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject> uploadImages(
            @RequestParam("productCode") String productCode,
            @RequestParam("image") List<MultipartFile> files) {
        try {
            Product existingProduct = productService.getProductByProductCode(productCode);
            files = files == null ? new ArrayList<>() : files;

            final int MAXIMUM_IMAGES_PER_PRODUCT = 5;
            if (files.size() > MAXIMUM_IMAGES_PER_PRODUCT) {
                return ResponseEntity.badRequest().body(ResponseObject.builder()
                        .message("Tối đa " + MAXIMUM_IMAGES_PER_PRODUCT + " hình ảnh được phép cho mỗi sản phẩm")
                        .status(HttpStatus.BAD_REQUEST)
                        .build());
            }

            if (existingProduct.getImages().size() + files.size() > MAXIMUM_IMAGES_PER_PRODUCT) {
                return ResponseEntity.badRequest().body(ResponseObject.builder()
                        .message("Tổng số hình ảnh vượt quá tối đa " + MAXIMUM_IMAGES_PER_PRODUCT)
                        .status(HttpStatus.BAD_REQUEST)
                        .build());
            }

            List<String> imageUrls = new ArrayList<>();
            for (MultipartFile file : files) {
                if (file.getSize() == 0) {
                    continue;
                }
                if (file.getSize() > 10 * 1024 * 1024) { // > 10MB
                    return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(ResponseObject.builder()
                            .message("Kích thước tập tin vượt quá 10MB")
                            .status(HttpStatus.PAYLOAD_TOO_LARGE)
                            .build());
                }
                String contentType = file.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(ResponseObject.builder()
                            .message("Tệp phải là hình ảnh")
                            .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                            .build());
                }

                String imageUrl = storeFile(file);
                imageUrls.add(imageUrl);
                existingProduct.addImage(imageUrl);
            }

            productService.updateProduct(existingProduct);

            return ResponseEntity.ok(ResponseObject.builder()
                    .message("Tải hình ảnh lên thành công")
                    .status(HttpStatus.OK)
                    .data(new ProductResponse(existingProduct))
                    .build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseObject.builder()
                    .message("Lỗi khi tải hình ảnh lên: " + e.getMessage())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build());
        }
    }

    private String storeFile(MultipartFile file) throws IOException {
        String uploadDir = System.getProperty("user.dir") + "/uploads/products/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File destination = new File(uploadDir + fileName);
        file.transferTo(destination);
        return "products/" + fileName; // Trả về URL đầy đủ
    }

    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> viewImage(@PathVariable String imageName) {
        try {
            java.nio.file.Path imagePath = Paths.get(System.getProperty("user.dir") + "/uploads/products/" + imageName);
            UrlResource resource = new UrlResource(imagePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
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

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(new ProductResponse(product));
    }
}