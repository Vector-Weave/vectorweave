package com.ezvector.backend.config;

import com.ezvector.backend.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Security Configuration - The Main Security Setup
 *
 * This configures Spring Security for your API:
 * 1. CORS - Which domains can call your API
 * 2. Authentication - Which endpoints require login
 * 3. JWT Filter - How to validate tokens
 *
 * Security Model:
 * - Stateless (no sessions, JWT only)
 * - CSRF disabled (not needed for stateless APIs)
 * - JWT-based authentication via Supabase
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${cors.allowed.origins:http://localhost:5173}")
    private String allowedOrigins;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * Main Security Filter Chain Configuration
     *
     * This defines:
     * - Which endpoints are public (no auth required)
     * - Which endpoints require authentication
     * - Where to add the JWT filter
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS for cross-origin requests (frontend on different port/domain)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Disable CSRF protection
            // Why? Our API is stateless (JWT-based), no cookies/sessions
            // CSRF only affects cookie-based auth
            .csrf(csrf -> csrf.disable())

            // Authorization rules - WHO can access WHAT
            .authorizeHttpRequests(auth -> auth
                // PUBLIC ENDPOINTS - No authentication required
                .requestMatchers("/api/test/**").permitAll()  // Health check endpoints
                .requestMatchers("/api/stripe/webhook").permitAll()  // Stripe webhooks (verified by signature)

                // PROTECTED ENDPOINTS - Authentication required
                .requestMatchers("/api/cart/**").authenticated()  // Cart operations
                .requestMatchers("/api/orders/**").authenticated()  // Orders
                .requestMatchers("/api/stripe/create-checkout-session").authenticated()  // Stripe checkout
                .requestMatchers("/api/stripe/verify-session/**").authenticated()  // Verify payment
                .requestMatchers("/api/customers/**").authenticated()  // Customer data
                .requestMatchers("/api/managers/**").authenticated()  // Manager operations

                // Everything else - require authentication by default (secure by default)
                .anyRequest().authenticated()
            )

            // Stateless session management
            // We don't use server-side sessions, everything is in the JWT
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // ADD OUR JWT FILTER
            // This runs BEFORE Spring's authentication filter
            // It validates the JWT and sets authentication in SecurityContext
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(","))); // Support multiple origins
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
