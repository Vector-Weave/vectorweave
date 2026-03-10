package com.ezvector.backend.service;

import com.ezvector.backend.dto.CreateCheckoutSessionRequest;
import com.ezvector.backend.dto.CreateCheckoutSessionResponse;
import com.ezvector.backend.model.Cart;
import com.ezvector.backend.model.CartItem;
import com.ezvector.backend.model.Customer;
import com.ezvector.backend.model.CustomerSupabaseMapping;
import com.ezvector.backend.repository.CartRepository;
import com.ezvector.backend.repository.CustomerRepository;
import com.ezvector.backend.repository.CustomerSupabaseMappingRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Service
public class StripeService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerSupabaseMappingRepository mappingRepository;

    @Value("${stripe.api.key:}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        if (stripeApiKey == null || stripeApiKey.isEmpty()) {
            throw new IllegalStateException("Stripe API key is not configured. Please set STRIPE_SECRET_KEY environment variable.");
        }
        Stripe.apiKey = stripeApiKey;
    }

    public CreateCheckoutSessionResponse createCheckoutSession(CreateCheckoutSessionRequest request) throws StripeException {

        // Get customer and cart
        CustomerSupabaseMapping mapping = mappingRepository
                .findBySupabaseUserId(request.getSupabaseUserId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Customer customer = customerRepository.findById(mapping.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Cart cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new RuntimeException("Cart is empty"));

        if (cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Create line items from cart
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
        
        for (CartItem item : cart.getCartItems()) {
            SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                    .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("usd")
                                    .setUnitAmount((long) (item.getPrice() * 100)) // Convert to cents
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName(item.getPlasmidName())
                                                    .setDescription("Build Type: " + item.getBuildType() + 
                                                                  (item.getBackboneName() != null ? " | Backbone: " + item.getBackboneName() : ""))
                                                    .build()
                                    )
                                    .build()
                    )
                    .setQuantity(1L)
                    .build();
            
            lineItems.add(lineItem);
        }

        // Store userId in metadata for webhook processing
        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(request.getSuccessUrl())
                .setCancelUrl(request.getCancelUrl())
                .addAllLineItem(lineItems)
                .putMetadata("supabaseUserId", request.getSupabaseUserId())
                .putMetadata("customerId", String.valueOf(customer.getUserID()))
                .build();

        Session session = Session.create(params);

        return new CreateCheckoutSessionResponse(session.getId(), session.getUrl());
    }

    public Session verifySession(String sessionId) throws StripeException {
        return Session.retrieve(sessionId);
    }
}
