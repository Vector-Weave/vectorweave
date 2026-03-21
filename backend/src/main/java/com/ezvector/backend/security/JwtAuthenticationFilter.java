package com.ezvector.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT Authentication Filter - The Security Gatekeeper
 *
 * This filter runs BEFORE your controllers, on every request.
 *
 * Flow:
 * 1. Request comes in → Filter intercepts it
 * 2. Filter looks for "Authorization: Bearer <token>" header
 * 3. Validates token with SupabaseJwtValidator
 * 4. If valid → Sets user as authenticated in Spring Security
 * 5. Request proceeds to controller
 * 6. If invalid → Request is rejected (401 Unauthorized)
 *
 * Why extend OncePerRequestFilter?
 * - Ensures filter runs exactly once per request
 * - Prevents double-filtering on error pages or forwards
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final SupabaseJwtValidator jwtValidator;

    public JwtAuthenticationFilter(SupabaseJwtValidator jwtValidator) {
        this.jwtValidator = jwtValidator;
    }

    /**
     * Main filter logic - runs on every request
     */
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // STEP 1: Extract Authorization header
        String authHeader = request.getHeader("Authorization");

        // If no Authorization header, continue without authentication
        // SecurityConfig will decide if this endpoint requires auth
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // STEP 2: Extract the JWT token
            // "Bearer eyJhbGci..." → "eyJhbGci..."
            String jwt = authHeader.substring(7);

            // STEP 3: Validate the JWT and extract claims
            Claims claims = jwtValidator.validateToken(jwt);

            // STEP 4: Extract user information from claims
            String userId = jwtValidator.getUserIdFromClaims(claims);
            String email = jwtValidator.getEmailFromClaims(claims);

            // STEP 5: Create Spring Security Authentication object
            // This tells Spring Security: "This user is authenticated"
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userId,  // Principal (the user ID)
                            null,    // Credentials (not needed after validation)
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))  // Authorities
                    );

            // Attach request details (IP address, session, etc.)
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // STEP 6: Store authentication in SecurityContext
            // Now your controllers can access the authenticated user via:
            // SecurityContextHolder.getContext().getAuthentication().getPrincipal()
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Log successful authentication (helpful for debugging)
            logger.debug("Successfully authenticated user: " + userId + " (" + email + ")");

        } catch (JwtException e) {
            // Token validation failed
            logger.warn("JWT validation failed: " + e.getMessage());

            // Clear any existing authentication
            SecurityContextHolder.clearContext();

            // You could return 401 here, but we let SecurityConfig handle it
            // This allows the security config to decide if this endpoint requires auth
        } catch (Exception e) {
            logger.error("Error processing JWT", e);
            SecurityContextHolder.clearContext();
        }

        // STEP 7: Continue the filter chain
        // If authenticated → user info is in SecurityContext
        // If not authenticated → SecurityContext is empty
        // SecurityConfig decides what to do next
        filterChain.doFilter(request, response);
    }
}
