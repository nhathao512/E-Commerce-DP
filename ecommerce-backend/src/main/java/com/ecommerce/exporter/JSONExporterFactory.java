package com.ecommerce.exporter;

public class JSONExporterFactory extends ExporterFactory {
    @Override
    public Exporter createExporter() {
        return new JSONExporter();
    }
}