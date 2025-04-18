package com.ecommerce.exporter;

import com.ecommerce.dto.ProductCount;
import com.ecommerce.dto.UserCount;
import java.util.List;
import java.io.ByteArrayOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;

public class CSVExporter implements Exporter {
    @Override
    public byte[] export(List<?> data) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        // Use UTF-8 encoding explicitly
        PrintWriter writer = new PrintWriter(new OutputStreamWriter(baos, StandardCharsets.UTF_8));

        if (!data.isEmpty()) {
            Object firstItem = data.get(0);
            if (firstItem instanceof ProductCount) {
                writer.println("Name,Count");
                for (Object item : data) {
                    ProductCount product = (ProductCount) item;
                    // Escape CSV values to handle commas and quotes in Vietnamese text
                    writer.println(String.format("%s,%d",
                            escapeCsvValue(product.getName()),
                            product.getCount()));
                }
            } else if (firstItem instanceof UserCount) {
                writer.println("Username,FullName,Count");
                for (Object item : data) {
                    UserCount user = (UserCount) item;
                    writer.println(String.format("%s,%s,%d",
                            escapeCsvValue(user.getUsername()),
                            escapeCsvValue(user.getFullName()),
                            user.getCount()));
                }
            }
        }
        writer.flush();
        return baos.toByteArray();
    }

    // Helper method to properly escape CSV values
    private String escapeCsvValue(String value) {
        if (value == null) {
            return "";
        }
        // If the value contains commas, quotes, or newlines, wrap it in quotes and escape internal quotes
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}