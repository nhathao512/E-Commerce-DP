package com.ecommerce.exporter;

public class CSVExporterFactory extends ExporterFactory {
    @Override
    public Exporter createExporter() {
        return new CSVExporter();
    }
}