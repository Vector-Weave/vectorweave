package com.ezvector.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Validates JWT tokens from Supabase Auth.
 *
 * How it works:
 * 1. Supabase signs JWTs with JWT_SECRET from your project settings
 * 2. This validator uses the same secret to verify the signature
 * 3. If valid, we trust the user ID and other claims in the token
 *
 * Security:
 * - JWT_SECRET must be kept secret (never commit to git!)
 * - Tokens have expiration time - we check this
 * - Signature verification prevents token tampering
 */
@Component
public class SupabaseJwtValidator {

    private final SecretKey signingKey;

    /**
     * Constructor: Initializes the secret key for JWT verification
     *
     * @param jwtSecret - Your Supabase JWT_SECRET from project settings
     *                    Get it from: Supabase Dashboard → Settings → API → JWT Secret
     */
    public SupabaseJwtValidator(@Value("${supabase.jwt.secret}") String jwtSecret) {
        if (jwtSecret == null || jwtSecret.isEmpty()) {
            throw new IllegalStateException("Supabase JWT secret is not configured! " +
                    "Add SUPABASE_JWT_SECRET to your environment variables.");
        }
        // Convert the secret string to a cryptographic key
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Validates a JWT token and extracts the claims (user info)
     *
     * @param token - The JWT token (without "Bearer " prefix)
     * @return Claims object containing user ID, email, etc.
     * @throws JwtException if token is invalid, expired, or tampered with
     */
    public Claims validateToken(String token) throws JwtException {
        try {
            // Parse and verify the JWT
            // This checks:
            // 1. Signature is valid (token not tampered)
            // 2. Token is not expired
            // 3. Token format is correct
            return Jwts.parser()
                    .verifyWith(signingKey)  // Verify signature with secret key
                    .build()
                    .parseSignedClaims(token)  // Parse the token
                    .getPayload();  // Extract claims (user data)

        } catch (ExpiredJwtException e) {
            throw new JwtException("Token has expired. User needs to log in again.", e);
        } catch (MalformedJwtException e) {
            throw new JwtException("Invalid token format.", e);
        } catch (SecurityException e) {
            throw new JwtException("Token signature verification failed. Possible tampering detected.", e);
        } catch (Exception e) {
            throw new JwtException("Token validation failed: " + e.getMessage(), e);
        }
    }

    /**
     * Extracts the user ID from validated JWT claims
     *
     * Supabase stores the user ID in the "sub" (subject) claim
     * This is a standard JWT claim for user identity
     */
    public String getUserIdFromClaims(Claims claims) {
        return claims.getSubject();  // "sub" claim = user ID
    }

    /**
     * Extracts the user's email from validated JWT claims
     */
    public String getEmailFromClaims(Claims claims) {
        return claims.get("email", String.class);
    }

    /**
     * Checks if token is expired
     */
    public boolean isTokenExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }
}
