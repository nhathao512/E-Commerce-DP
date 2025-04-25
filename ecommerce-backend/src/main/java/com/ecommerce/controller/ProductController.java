package com.ecommerce.controller;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.dto.ResponseObject;
import com.ecommerce.model.ClothingProduct;
import com.ecommerce.model.Product;
import com.ecommerce.model.ShoeProduct;
import com.ecommerce.service.ProductService;
import com.ecommerce.template.ProductImageUploader;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService productService;
    private final ProductImageUploader productImageUploader;

    @Autowired
    public ProductController(ProductService productService, ProductImageUploader productImageUploader) {
        this.productService = productService;
        this.productImageUploader = productImageUploader;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("categoryId") String categoryId,
            @RequestParam("type") String type,
            @RequestParam(value = "sole", required = false) String sole,
            @RequestParam(value = "material", required = false) String material,
            @RequestParam("sizes") String sizesJson,
            @RequestParam("quantity") String quantityJson,
            @RequestParam(value = "image", required = false) List<MultipartFile> images) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            List<String> sizes = mapper.readValue(sizesJson, new TypeReference<List<String>>(){});
            Map<String, Integer> quantity = mapper.readValue(quantityJson, new TypeReference<Map<String, Integer>>(){});

            ProductRequest request = new ProductRequest();
            request.setName(name);
            request.setPrice(price);
            request.setCategoryId(categoryId);
            request.setDescription(description);
            request.setType(type);
            request.setSole(sole);
            request.setMaterial(material);
            request.setSizes(sizes);
            request.setQuantity(quantity);

            Product product = productService.addProduct(request);

            if (images != null && !images.isEmpty()) {
                List<String> imageUrls = productImageUploader.uploadMultipleImages(images);
                for (String imageUrl : imageUrls) {
                    product.addImage(imageUrl);
                }
                productService.updateProduct(product);
            }

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
            @RequestParam(value = "image", required = false) List<MultipartFile> files,
            @RequestParam(value = "deletedImages", required = false) String deletedImagesJson) {
        try {
            Product existingProduct = productService.getProductByProductCode(productCode);
            files = files == null ? List.of() : files;

            final int MAXIMUM_IMAGES_PER_PRODUCT = 5;
            ObjectMapper mapper = new ObjectMapper();
            List<String> deletedImages = deletedImagesJson != null
                    ? mapper.readValue(deletedImagesJson, new TypeReference<List<String>>(){})
                    : List.of();

            for (String imageName : deletedImages) {
                productService.deleteImage(existingProduct, imageName);
            }

            int remainingImages = existingProduct.getImages().size();
            if (remainingImages + files.size() > MAXIMUM_IMAGES_PER_PRODUCT) {
                return ResponseEntity.badRequest().body(ResponseObject.builder()
                        .message("Tổng số hình ảnh vượt quá tối đa " + MAXIMUM_IMAGES_PER_PRODUCT)
                        .status(HttpStatus.BAD_REQUEST)
                        .build());
            }

            if (!files.isEmpty()) {
                List<String> imageUrls = productImageUploader.uploadMultipleImages(files);
                for (String imageUrl : imageUrls) {
                    existingProduct.addImage(imageUrl);
                }
                productService.updateProduct(existingProduct);
            }

            return ResponseEntity.ok(ResponseObject.builder()
                    .message("Cập nhật hình ảnh thành công")
                    .status(HttpStatus.OK)
                    .data(new ProductResponse(existingProduct))
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ResponseObject.builder()
                    .message(e.getMessage())
                    .status(HttpStatus.BAD_REQUEST)
                    .build());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseObject.builder()
                    .message("Lỗi khi cập nhật hình ảnh: " + e.getMessage())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build());
        }
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

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseObject> updateProduct(
            @PathVariable String id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("categoryId") String categoryId,
            @RequestParam("type") String type,
            @RequestParam(value = "sole", required = false) String sole,
            @RequestParam(value = "material", required = false) String material,
            @RequestParam("sizes") String sizesJson,
            @RequestParam("quantity") String quantityJson,
            @RequestParam(value = "image", required = false) List<MultipartFile> images) {
        try {
            Product existingProduct = productService.getProductById(id);

            ObjectMapper mapper = new ObjectMapper();
            List<String> sizes = mapper.readValue(sizesJson, new TypeReference<List<String>>(){});
            Map<String, Integer> quantity = mapper.readValue(quantityJson, new TypeReference<Map<String, Integer>>(){});

            existingProduct.setName(name);
            existingProduct.setDescription(description);
            existingProduct.setPrice(price);
            existingProduct.setCategoryId(categoryId);
            if (type.equalsIgnoreCase("shoe")) {
                ((ShoeProduct) existingProduct).setSole(sole);
            } else if (type.equalsIgnoreCase("clothing")) {
                ((ClothingProduct) existingProduct).setMaterial(material);
            }
            existingProduct.setSizes(sizes);
            existingProduct.setQuantity(quantity);

            if (images != null && !images.isEmpty()) {
                List<String> imageUrls = productImageUploader.uploadMultipleImages(images);
                existingProduct.setImages(imageUrls);
            }

            Product updatedProduct = productService.updateProduct(existingProduct);
            return ResponseEntity.ok(ResponseObject.builder()
                    .message("Cập nhật sản phẩm thành công")
                    .status(HttpStatus.OK)
                    .data(new ProductResponse(updatedProduct))
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ResponseObject.builder()
                    .message("Error updating product: " + e.getMessage())
                    .status(HttpStatus.BAD_REQUEST)
                    .build());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseObject> deleteProduct(@PathVariable String id) {
        try {
            Product product = productService.getProductById(id);
            productService.deleteProduct(id);
            return ResponseEntity.ok(ResponseObject.builder()
                    .message("Xóa sản phẩm thành công")
                    .status(HttpStatus.OK)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ResponseObject.builder()
                    .message("Error deleting product: " + e.getMessage())
                    .status(HttpStatus.BAD_REQUEST)
                    .build());
        }
    }

    @DeleteMapping("/{productId}/images/{imageName}")
    public ResponseEntity<ResponseObject> deleteImage(
            @PathVariable String productId,
            @PathVariable String imageName) {
        try {
            Product product = productService.getProductById(productId);

            productService.deleteImage(product, imageName);

            return ResponseEntity.ok(ResponseObject.builder()
                    .message("Xóa hình ảnh thành công")
                    .status(HttpStatus.OK)
                    .data(new ProductResponse(product))
                    .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ResponseObject.builder()
                    .message(e.getMessage())
                    .status(HttpStatus.BAD_REQUEST)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ResponseObject.builder()
                    .message("Lỗi khi xóa hình ảnh: " + e.getMessage())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build());
        }
    }
}