package com.ezvector.backend.controller;

import com.ezvector.backend.dto.AddToCartRequest;
import com.ezvector.backend.dto.CartResponse;
import com.ezvector.backend.dto.OrderResponse;
import com.ezvector.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request) {
        try {
            CartResponse response = cartService.addToCart(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add to cart: " + e.getMessage());
        }
    }

    @GetMapping("/{supabaseUserId}")
    public ResponseEntity<?> getCart(@PathVariable String supabaseUserId) {
        try {
            CartResponse response = cartService.getCart(supabaseUserId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/{supabaseUserId}/items/{cartItemId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable String supabaseUserId,
            @PathVariable Integer cartItemId) {
        try {
            cartService.removeFromCart(supabaseUserId, cartItemId);
            return ResponseEntity.ok("Item removed from cart");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to remove from cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/{supabaseUserId}/clear")
    public ResponseEntity<?> clearCart(@PathVariable String supabaseUserId) {
        try {
            cartService.clearCart(supabaseUserId);
            return ResponseEntity.ok("Cart cleared");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to clear cart: " + e.getMessage());
        }
    }

    @PostMapping("/{supabaseUserId}/checkout")
    public ResponseEntity<?> checkout(@PathVariable String supabaseUserId) {
        try {
            List<OrderResponse> orders = cartService.checkoutCart(supabaseUserId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Checkout failed: " + e.getMessage());
        }
    }
}
