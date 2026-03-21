package com.ezvector.backend.security;

/**
 * Exception thrown when a user tries to access a resource they don't own
 *
 * This is different from authentication failure (401):
 * - 401 Unauthorized = You need to log in
 * - 403 Forbidden = You are logged in, but you can't access this
 *
 * Example:
 * - User A is logged in (authenticated) ✅
 * - User A tries to delete User B's cart item
 * - Throw UnauthorizedException → Returns 403 Forbidden
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}
