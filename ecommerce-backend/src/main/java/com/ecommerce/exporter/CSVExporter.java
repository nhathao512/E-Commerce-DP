package com.ecommerce.exporter;

import com.ecommerce.dto.ProductCount;
import com.ecommerce.dto.UserCount;
import java.util.List;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;

public class CSVExporter implements Exporter {
    @Override
    public byte[] export(List<?> data) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(baos);

        if (!data.isEmpty()) {
            Object firstItem = data.get(0);
            if (firstItem instanceof ProductCount) {
                writer.println("Name,Count");
                for (Object item : data) {
                    ProductCount product = (ProductCount) item;
                    writer.println(String.format("%s,%d", product.getName(), product.getCount()));
                }
            } else if (firstItem instanceof UserCount) {
                writer.println("Username,FullName,Count");
                for (Object item : data) {
                    UserCount user = (UserCount) item;
                    writer.println(String.format("%s,%s,%d", user.getUsername(), user.getFullName(), user.getCount()));
                }
            }
        }
        writer.flush();
        return baos.toByteArray();
    }
}