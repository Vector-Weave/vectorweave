package com.ezvector.backend.controller;

import com.ezvector.backend.dto.CreateOrderRequest;
import com.ezvector.backend.dto.OrderResponse;
import com.ezvector.backend.security.AuthorizationHelper;
import com.ezvector.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Order Controller - Manages order operations
 *
 * Security:
 * - All endpoints require authentication
 * - Authorization checks ensure users only access their own orders
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private AuthorizationHelper authHelper;

    /**
     * Create a new order
     *
     * Security: User can only create orders for themselves
     */
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        // AUTHORIZATION CHECK: User can only create their own order
        if (!authHelper.isCurrentUser(request.getSupabaseUserId())) {
            return ResponseEntity.status(403).build();
        }

        OrderResponse response = orderService.createOrder(request);

        if (response.getOrderId() == null) {
            return ResponseEntity.badRequest().body(response);
        }

        return ResponseEntity.ok(response);
    }

    /**
     * Get all orders for a user
     *
     * Security: User can only view their own orders
     */
    @GetMapping("/{supabaseUserId}")
    public ResponseEntity<?> getUserOrders(@PathVariable String supabaseUserId) {
        try {
            // AUTHORIZATION CHECK: User can only view their own orders
            if (!authHelper.isCurrentUser(supabaseUserId)) {
                return ResponseEntity.status(403).body("Forbidden: Cannot access another user's orders");
            }

            List<OrderResponse> orders = orderService.getUserOrders(supabaseUserId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get orders: " + e.getMessage());
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Order endpoint is working!");
    }
}
