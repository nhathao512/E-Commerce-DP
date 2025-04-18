package com.ecommerce.exporter;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;

public class JSONExporter implements Exporter {
    @Override
    public byte[] export(List<?> data) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(data).getBytes();
    }
}