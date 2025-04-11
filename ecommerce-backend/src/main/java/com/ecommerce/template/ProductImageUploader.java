package com.ecommerce.template;

import org.springframework.stereotype.Component;

@Component
public class ProductImageUploader extends FileUploadTemplate {
    @Override
    protected String getSubDirectory() {
        return "products";
    }

    @Override
    protected String postProcess(String fileUrl) {
        return fileUrl; // Chỉ trả về URL
    }
}