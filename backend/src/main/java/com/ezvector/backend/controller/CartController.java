package com.ezvector.backend.controller;

import com.ezvector.backend.dto.AddToCartRequest;
import com.ezvector.backend.dto.CartResponse;
import com.ezvector.backend.dto.OrderResponse;
import com.ezvector.backend.security.AuthorizationHelper;
import com.ezvector.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Cart Controller - Manages shopping cart operations
 *
 * Security:
 * - All endpoints require authentication (configured in SecurityConfig)
 * - Authorization checks ensure users only access their own cart
 * - CORS handled centrally (removed @CrossOrigin)
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private AuthorizationHelper authHelper;

    /**
     * Add item to cart
     *
     * Security Check:
     * - Verifies the authenticated user matches the user ID in request body
     * - Prevents User A from adding items to User B's cart
     */
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request) {
        try {
            // AUTHORIZATION CHECK: Is this their own cart?
            if (!authHelper.isCurrentUser(request.getSupabaseUserId())) {
                return ResponseEntity.status(403).body("Forbidden: Cannot add items to another user's cart");
            }

            CartResponse response = cartService.addToCart(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add to cart: " + e.getMessage());
        }
    }

    /**
     * Get user's cart
     *
     * Security Check:
     * - Verifies authenticated user ID matches the requested user ID
     * - Prevents users from viewing others' carts
     */
    @GetMapping("/{supabaseUserId}")
    public ResponseEntity<?> getCart(@PathVariable String supabaseUserId) {
        try {
            // AUTHORIZATION CHECK: Is this their own cart?
            if (!authHelper.isCurrentUser(supabaseUserId)) {
                return ResponseEntity.status(403).body("Forbidden: Cannot access another user's cart");
            }

            CartResponse response = cartService.getCart(supabaseUserId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get cart: " + e.getMessage());
        }
    }

    /**
     * Remove item from cart
     *
     * Security Check:
     * - Ensures user can only remove items from their own cart
     */
    @DeleteMapping("/{supabaseUserId}/items/{cartItemId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable String supabaseUserId,
            @PathVariable Integer cartItemId) {
        try {
            // AUTHORIZATION CHECK
            if (!authHelper.isCurrentUser(supabaseUserId)) {
                return ResponseEntity.status(403).body("Forbidden: Cannot modify another user's cart");
            }

            cartService.removeFromCart(supabaseUserId, cartItemId);
            return ResponseEntity.ok("Item removed from cart");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to remove from cart: " + e.getMessage());
        }
    }

    /**
     * Clear entire cart
     *
     * Security Check:
     * - Prevents malicious users from clearing others' carts
     */
    @DeleteMapping("/{supabaseUserId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable String supabaseUserId) {
        try {
            // AUTHORIZATION CHECK
            if (!authHelper.isCurrentUser(supabaseUserId)) {
                return ResponseEntity.status(403).body("Forbidden: Cannot clear another user's cart");
            }

            cartService.clearCart(supabaseUserId);
            return ResponseEntity.ok("Cart cleared");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to clear cart: " + e.getMessage());
        }
    }

    /**
     * Checkout cart - creates orders from cart items
     *
     * Security Check:
     * - Ensures user is checking out their own cart
     */
    @PostMapping("/{supabaseUserId}/checkout")
    public ResponseEntity<?> checkout(@PathVariable String supabaseUserId) {
        try {
            // AUTHORIZATION CHECK
            if (!authHelper.isCurrentUser(supabaseUserId)) {
                return ResponseEntity.status(403).body("Forbidden: Cannot checkout another user's cart");
            }

            List<OrderResponse> orders = cartService.checkoutCart(supabaseUserId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Checkout failed: " + e.getMessage());
        }
    }
}

