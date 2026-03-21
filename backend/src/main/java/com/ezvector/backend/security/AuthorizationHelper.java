package com.ezvector.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Authorization Helper - Checks User Permissions
 *
 * Authentication vs Authorization:
 * - Authentication = WHO are you? (verified by JWT)
 * - Authorization = WHAT can you access? (checked here)
 *
 * Example:
 * - User A is authenticated (has valid JWT) ✅
 * - User A tries to access User B's cart ❌
 * - This class checks: Does authenticated user own this resource?
 *
 * Security Principle: "Verify resource ownership"
 * - Just because you're logged in doesn't mean you can access everything
 * - Users should only access their OWN data
 */
@Component
public class AuthorizationHelper {

    /**
     * Gets the currently authenticated user's ID
     *
     * How it works:
     * 1. JwtAuthenticationFilter already validated the JWT
     * 2. Filter stored user ID in SecurityContext
     * 3. We retrieve it from there
     *
     * @return User ID from JWT token, or null if not authenticated
     */
    public String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Check if user is authenticated
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        // The principal contains the user ID (set by JwtAuthenticationFilter)
        Object principal = authentication.getPrincipal();

        // Handle "anonymousUser" case (not logged in)
        if (principal instanceof String && !principal.equals("anonymousUser")) {
            return (String) principal;
        }

        return null;
    }

    /**
     * Verifies that the authenticated user matches the requested user ID
     *
     * Use this in controllers to prevent users from accessing other users' data.
     *
     * Example usage in controller:
     * ```java
     * @GetMapping("/{supabaseUserId}")
     * public ResponseEntity<?> getCart(@PathVariable String supabaseUserId) {
     *     // Check authorization
     *     if (!authHelper.isCurrentUser(supabaseUserId)) {
     *         return ResponseEntity.status(403).body("Forbidden: Cannot access other users' data");
     *     }
     *
     *     // User owns this resource, proceed
     *     CartResponse response = cartService.getCart(supabaseUserId);
     *     return ResponseEntity.ok(response);
     * }
     * ```
     *
     * @param userId - The user ID from the request path/body
     * @return true if authenticated user matches the requested user ID
     */
    public boolean isCurrentUser(String userId) {
        String currentUserId = getCurrentUserId();

        // Not authenticated
        if (currentUserId == null) {
            return false;
        }

        // Check if user is trying to access their own data
        return currentUserId.equals(userId);
    }

    /**
     * Verifies authorization and throws exception if unauthorized
     *
     * This is a convenience method that throws an exception instead of returning boolean.
     * Use when you want Spring to handle the error automatically.
     *
     * @param userId - The user ID to verify
     * @throws UnauthorizedException if user is not authorized
     */
    public void requireCurrentUser(String userId) throws UnauthorizedException {
        if (!isCurrentUser(userId)) {
            String currentUserId = getCurrentUserId();
            throw new UnauthorizedException(
                "Forbidden: User " + currentUserId + " cannot access resources for user " + userId
            );
        }
    }
}
