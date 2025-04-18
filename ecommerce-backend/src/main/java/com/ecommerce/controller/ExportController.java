package com.ecommerce.controller;

import com.ecommerce.dto.ProductCount;
import com.ecommerce.dto.UserCount;
import com.ecommerce.exporter.*;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Order;
import com.ecommerce.model.User;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger logger = LoggerFactory.getLogger(ExportController.class);

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
            // Lấy danh sách đơn hàng
            List<Order> orders = orderService.getAllOrders();
            if (orders.isEmpty()) {
                logger.warn("No orders found for exporting top products.");
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
                                    logger.warn("Quantity is null for item: {}", item);
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
                logger.warn("No completed orders found for top products.");
                return ResponseEntity.badRequest()
                        .body(new ByteArrayResource("No completed orders available.".getBytes()));
            }

            ExporterFactory factory = getExporterFactory(format);
            Exporter exporter = factory.createExporter();
            byte[] data = exporter.export(topProducts);

            return createResponse(data, "top_products", format);
        } catch (Exception e) {
            logger.error("Error exporting top products: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new ByteArrayResource(("Error exporting top products: " + e.getMessage()).getBytes()));
        }
    }

    @GetMapping("/top-users")
    public ResponseEntity<ByteArrayResource> exportTopUsers(
            @RequestParam String format) {
        try {
            // Lấy danh sách đơn hàng
            List<Order> orders = orderService.getAllOrders();
            if (orders.isEmpty()) {
                logger.warn("No orders found for exporting top users.");
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
                            logger.warn("User not found for ID {}: {}", entry.getKey(), e.getMessage());
                            return new UserCount("Unknown", "N/A", entry.getValue());
                        }
                    })
                    .sorted((a, b) -> b.getCount() - a.getCount())
                    .limit(10)
                    .collect(Collectors.toList());

            if (topUsers.isEmpty()) {
                logger.warn("No completed orders found for top users.");
                return ResponseEntity.badRequest()
                        .body(new ByteArrayResource("No completed orders available.".getBytes()));
            }

            ExporterFactory factory = getExporterFactory(format);
            Exporter exporter = factory.createExporter();
            byte[] data = exporter.export(topUsers);

            return createResponse(data, "top_users", format);
        } catch (Exception e) {
            logger.error("Error exporting top users: {}", e.getMessage(), e);
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
        String contentType;
        String extension = format.toLowerCase();

        if (format.equalsIgnoreCase("csv")) {
            // Specify charset for CSV to handle Vietnamese characters
            contentType = "text/csv;charset=UTF-8";
        } else {
            // Specify charset for JSON to handle Vietnamese characters
            contentType = "application/json;charset=UTF-8";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + filename + "." + extension)
                .body(new ByteArrayResource(data));
    }
}