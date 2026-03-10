package com.ezvector.backend.controller;

import com.ezvector.backend.dto.CreateCheckoutSessionRequest;
import com.ezvector.backend.dto.CreateCheckoutSessionResponse;
import com.ezvector.backend.service.CartService;
import com.ezvector.backend.service.StripeService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stripe")
public class StripeController {

    @Autowired
    private StripeService stripeService;

    @Autowired
    private CartService cartService;

    @Value("${stripe.webhook.secret:}")
    private String webhookSecret;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestBody CreateCheckoutSessionRequest request) {
        try {
            CreateCheckoutSessionResponse response = stripeService.createCheckoutSession(request);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body("Failed to create checkout session: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/verify-session/{sessionId}")
    public ResponseEntity<?> verifySession(@PathVariable String sessionId) {
        try {
            Session session = stripeService.verifySession(sessionId);
            return ResponseEntity.ok(session);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body("Failed to verify session: " + e.getMessage());
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        // Handle the event
        switch (event.getType()) {
            case "checkout.session.completed":
                Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
                if (session != null) {
                    // Get user ID from metadata
                    String supabaseUserId = session.getMetadata().get("supabaseUserId");
                    
                    if (supabaseUserId != null) {
                        try {
                            // Process the order
                            cartService.checkoutCart(supabaseUserId);
                        } catch (Exception e) {
                            System.err.println("Failed to process order after payment: " + e.getMessage());
                        }
                    }
                }
                break;
            case "payment_intent.payment_failed":
                // Handle payment failure
                System.out.println("Payment failed");
                break;
            default:
                System.out.println("Unhandled event type: " + event.getType());
        }

        return ResponseEntity.ok("Success");
    }
}
