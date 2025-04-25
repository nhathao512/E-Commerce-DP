package com.ecommerce.controller;

import com.ecommerce.dto.ProductCount;
import com.ecommerce.dto.UserCount;
import com.ecommerce.exporter.*;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Order;
import com.ecommerce.model.User;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/export")
@PreAuthorize("hasRole('ADMIN')")
public class ExportController {

    private final OrderService orderService;
    private final AuthService authService;

    @Autowired
    public ExportController(OrderService orderService, AuthService authService) {
        this.orderService = orderService;
        this.authService = authService;
    }

    @GetMapping("/top-products")
    public ResponseEntity<ByteArrayResource> exportTopProducts(
            @RequestParam String format) {
        try {
            List<Order> orders = orderService.getAllOrders();
            if (orders.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ByteArrayResource("No orders available.".getBytes()));
            }

            Map<String, ProductCount> productCounts = orders.stream()
                    .filter(order -> "Hoàn thành".equals(order.getStatus()))
                    .flatMap(order -> order.getItems().stream())
                    .collect(Collectors.groupingBy(
                            CartItem::getProductName,
                            Collectors.summingInt(item -> {
                                Integer quantity = item.getQuantity();
                                if (quantity == null) {
                                    return 1;
                                }
                                return quantity;
                            })
                    ))
                    .entrySet().stream()
                    .map(entry -> new ProductCount(entry.getKey(), entry.getValue()))
                    .sorted((a, b) -> b.getCount() - a.getCount())
                    .limit(10)
                    .collect(Collectors.toMap(
                            pc -> pc.getName(),
                            pc -> pc,
                            (a, b) -> a,
                            LinkedHashMap::new
                    ));

            List<ProductCount> topProducts = new ArrayList<>(productCounts.values());
            if (topProducts.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ByteArrayResource("No completed orders available.".getBytes()));
            }

            ExporterFactory factory = getExporterFactory(format);
            Exporter exporter = factory.createExporter();
            byte[] data = exporter.export(topProducts);

            return createResponse(data, "top_products", format);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ByteArrayResource(("Error exporting top products: " + e.getMessage()).getBytes()));
        }
    }

    @GetMapping("/top-users")
    public ResponseEntity<ByteArrayResource> exportTopUsers(
            @RequestParam String format) {
        try {
            List<Order> orders = orderService.getAllOrders();
            if (orders.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ByteArrayResource("No orders available.".getBytes()));
            }

            Map<String, Integer> userCounts = orders.stream()
                    .filter(order -> "Hoàn thành".equals(order.getStatus()))
                    .collect(Collectors.groupingBy(
                            Order::getUserId,
                            Collectors.summingInt(order -> 1)
                    ));

            List<UserCount> topUsers = userCounts.entrySet().stream()
                    .map(entry -> {
                        try {
                            User user = authService.getUserById(entry.getKey());
                            return new UserCount(
                                    user != null ? user.getUsername() : "Unknown",
                                    user != null ? user.getFullName() : "N/A",
                                    entry.getValue()
                            );
                        } catch (IllegalArgumentException e) {
                            return new UserCount("Unknown", "N/A", entry.getValue());
                        }
                    })
                    .sorted((a, b) -> b.getCount() - a.getCount())
                    .limit(10)
                    .collect(Collectors.toList());

            if (topUsers.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ByteArrayResource("No completed orders available.".getBytes()));
            }

            ExporterFactory factory = getExporterFactory(format);
            Exporter exporter = factory.createExporter();
            byte[] data = exporter.export(topUsers);

            return createResponse(data, "top_users", format);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ByteArrayResource(("Error exporting top users: " + e.getMessage()).getBytes()));
        }
    }

    private ExporterFactory getExporterFactory(String format) {
        return switch (format.toLowerCase()) {
            case "csv" -> new CSVExporterFactory();
            case "json" -> new JSONExporterFactory();
            default -> throw new IllegalArgumentException("Unsupported format: " + format);
        };
    }

    private ResponseEntity<ByteArrayResource> createResponse(byte[] data, String filename, String format) {
        String contentType = format.equalsIgnoreCase("csv") ? "text/csv" : "application/json";
        String extension = format.toLowerCase();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename + "." + extension)
                .body(new ByteArrayResource(data));
    }
}