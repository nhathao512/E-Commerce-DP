package com.ecommerce.exporter;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.nio.charset.StandardCharsets;

public class JSONExporter implements Exporter {
    @Override
    public byte[] export(List<?> data) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        // Use UTF-8 encoding explicitly
        return mapper.writeValueAsString(data).getBytes(StandardCharsets.UTF_8);
    }
}