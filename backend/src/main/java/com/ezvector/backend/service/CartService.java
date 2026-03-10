package com.ezvector.backend.service;

import com.ezvector.backend.dto.AddToCartRequest;
import com.ezvector.backend.dto.CartResponse;
import com.ezvector.backend.dto.CreateOrderRequest;
import com.ezvector.backend.dto.OrderResponse;
import com.ezvector.backend.model.*;
import com.ezvector.backend.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerSupabaseMappingRepository mappingRepository;

    @Autowired
    private OrderService orderService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public CartResponse addToCart(AddToCartRequest request) {
        try {
            // Get customer
            CustomerSupabaseMapping mapping = mappingRepository
                    .findBySupabaseUserId(request.getSupabaseUserId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            Customer customer = customerRepository.findById(mapping.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            // Get or create cart
            Cart cart = cartRepository.findByCustomer(customer)
                    .orElseGet(() -> {
                        Cart newCart = new Cart(customer);
                        return cartRepository.save(newCart);
                    });

            // Create cart item
            CartItem cartItem = new CartItem();
            cartItem.setPlasmidName(request.getPlasmidName());
            cartItem.setBuildType(request.getBuildType());
            cartItem.setBackboneName(request.getBackboneName());
            cartItem.setPrice(request.getPrice());

            // Serialize fragments and mutations to JSON
            if (request.getFragments() != null) {
                cartItem.setFragmentsData(objectMapper.writeValueAsString(request.getFragments()));
            }
            if (request.getMutations() != null) {
                cartItem.setMutationsData(objectMapper.writeValueAsString(request.getMutations()));
            }

            cart.addCartItem(cartItem);
            cartItemRepository.save(cartItem);
            cartRepository.save(cart);

            return buildCartResponse(cart);

        } catch (Exception e) {
            throw new RuntimeException("Failed to add to cart: " + e.getMessage(), e);
        }
    }

    public CartResponse getCart(String supabaseUserId) {
        try {
            CustomerSupabaseMapping mapping = mappingRepository
                    .findBySupabaseUserId(supabaseUserId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            Customer customer = customerRepository.findById(mapping.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            Cart cart = cartRepository.findByCustomer(customer)
                    .orElseGet(() -> new Cart(customer));

            return buildCartResponse(cart);

        } catch (Exception e) {
            throw new RuntimeException("Failed to get cart: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void removeFromCart(String supabaseUserId, Integer cartItemId) {
        try {
            CustomerSupabaseMapping mapping = mappingRepository
                    .findBySupabaseUserId(supabaseUserId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            Customer customer = customerRepository.findById(mapping.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            Cart cart = cartRepository.findByCustomer(customer)
                    .orElseThrow(() -> new RuntimeException("Cart not found"));

            CartItem itemToRemove = cart.getCartItems().stream()
                    .filter(item -> item.getCartItemId().equals(cartItemId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Cart item not found"));

            cart.removeCartItem(itemToRemove);
            cartItemRepository.delete(itemToRemove);
            cartRepository.save(cart);

        } catch (Exception e) {
            throw new RuntimeException("Failed to remove from cart: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void clearCart(String supabaseUserId) {
        try {
            CustomerSupabaseMapping mapping = mappingRepository
                    .findBySupabaseUserId(supabaseUserId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            Customer customer = customerRepository.findById(mapping.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            Cart cart = cartRepository.findByCustomer(customer)
                    .orElse(null);

            if (cart != null) {
                cart.getCartItems().clear();
                cartRepository.save(cart);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to clear cart: " + e.getMessage(), e);
        }
    }

    private CartResponse buildCartResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setCartId(cart.getCartId());

        List<CartResponse.CartItemDto> items = cart.getCartItems().stream()
                .map(item -> new CartResponse.CartItemDto(
                        item.getCartItemId(),
                        item.getPlasmidName(),
                        item.getBuildType(),
                        item.getBackboneName(),
                        item.getPrice(),
                        item.getAddedAt()
                ))
                .collect(Collectors.toList());

        response.setItems(items);
        response.setItemCount(items.size());
        response.setTotalPrice(items.stream().mapToInt(CartResponse.CartItemDto::getPrice).sum());

        return response;
    }

    @Transactional
    public List<OrderResponse> checkoutCart(String supabaseUserId) {
        try {
            CustomerSupabaseMapping mapping = mappingRepository
                    .findBySupabaseUserId(supabaseUserId)
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            Customer customer = customerRepository.findById(mapping.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            Cart cart = cartRepository.findByCustomer(customer)
                    .orElseThrow(() -> new RuntimeException("Cart is empty"));

            if (cart.getCartItems().isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }

            List<OrderResponse> orderResponses = new ArrayList<>();

            // Create an order for each cart item
            for (CartItem item : cart.getCartItems()) {
                CreateOrderRequest orderRequest = new CreateOrderRequest();
                orderRequest.setSupabaseUserId(supabaseUserId);
                orderRequest.setPlasmidName(item.getPlasmidName());
                
                // Parse build type
                CreateOrderRequest.BuildType buildType;
                try {
                    buildType = CreateOrderRequest.BuildType.valueOf(item.getBuildType());
                } catch (IllegalArgumentException e) {
                    buildType = CreateOrderRequest.BuildType.MULTI_INSERT;
                }
                orderRequest.setBuildType(buildType);
                orderRequest.setBackboneName(item.getBackboneName());
                orderRequest.setTotalPrice(item.getPrice());

                // Deserialize fragments and mutations from JSON
                try {
                    if (item.getFragmentsData() != null && !item.getFragmentsData().isEmpty()) {
                        List<CreateOrderRequest.FragmentDto> fragments = objectMapper.readValue(
                                item.getFragmentsData(),
                                new TypeReference<List<CreateOrderRequest.FragmentDto>>() {}
                        );
                        orderRequest.setFragments(fragments);
                    }

                    if (item.getMutationsData() != null && !item.getMutationsData().isEmpty()) {
                        List<String> mutations = objectMapper.readValue(
                                item.getMutationsData(),
                                new TypeReference<List<String>>() {}
                        );
                        orderRequest.setMutations(mutations);
                    }
                } catch (Exception e) {
                    throw new RuntimeException("Failed to parse cart item data: " + e.getMessage(), e);
                }

                // Create the order
                OrderResponse orderResponse = orderService.createOrder(orderRequest);
                orderResponses.add(orderResponse);
            }

            // Clear the cart after successful checkout
            clearCart(supabaseUserId);

            return orderResponses;

        } catch (Exception e) {
            throw new RuntimeException("Checkout failed: " + e.getMessage(), e);
        }
    }
}
