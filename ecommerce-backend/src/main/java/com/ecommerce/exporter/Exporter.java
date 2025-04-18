package com.ecommerce.exporter;

import java.util.List;

public interface Exporter {
    byte[] export(List<?> data) throws Exception;
}