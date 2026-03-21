package com.ezvector.backend.security;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Global Exception Handler for Security Errors
 *
 * What is @ControllerAdvice?
 * - Applies to ALL controllers in your application
 * - Catches exceptions before they bubble up to user
 * - Converts exceptions to proper HTTP responses
 *
 * Why do we need this?
 * - Centralized error handling (DRY - Don't Repeat Yourself)
 * - Consistent error response format
 * - Proper HTTP status codes
 *
 * Without this:
 * - UnauthorizedException → 500 Internal Server Error (wrong!)
 *
 * With this:
 * - UnauthorizedException → 403 Forbidden (correct!)
 */
@ControllerAdvice
public class SecurityExceptionHandler {

    /**
     * Handles UnauthorizedException
     *
     * Returns: 403 Forbidden
     * Message: The exception message
     *
     * HTTP Status Codes:
     * - 401 Unauthorized = Authentication failed (need to log in)
     * - 403 Forbidden = Authenticated but not allowed to access this resource
     * - 404 Not Found = Resource doesn't exist
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<String> handleUnauthorizedException(UnauthorizedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)  // 403
                .body(ex.getMessage());
    }
}
