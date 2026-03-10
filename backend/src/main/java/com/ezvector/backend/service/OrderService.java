package com.ezvector.backend.service;

import com.ezvector.backend.dto.CreateOrderRequest;
import com.ezvector.backend.dto.OrderResponse;
import com.ezvector.backend.model.*;
import com.ezvector.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerSupabaseMappingRepository mappingRepository;

    @Autowired
    private PlasmidRepository plasmidRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private FragmentRepository fragmentRepository;

    @Autowired
    private MutationRepository mutationRepository;

    @Autowired
    private MultiFragmentRepository multiFragmentRepository;

    @Autowired
    private MutagenesisRepository mutagenesisRepository;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        try {
            // 1. Get customer from Supabase mapping
            CustomerSupabaseMapping mapping = mappingRepository
                    .findBySupabaseUserId(request.getSupabaseUserId())
                    .orElseThrow(() -> new RuntimeException("Customer not found for Supabase user"));

            Customer customer = customerRepository.findById(mapping.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            // 2. Create Order
            Order order = new Order();
            order.setDatePlaced(OffsetDateTime.now());
            order.setTotalOrderPrice(request.getTotalPrice());
            order.setStatus(Order.OrderStatus.NOT_STARTED);
            order.setCustomerOrdering(customer);
            order = orderRepository.save(order);

            // 3. Create Plasmid based on build type
            Plasmid plasmid = createPlasmidFromRequest(request, customer);
            plasmid = plasmidRepository.save(plasmid);

            // 4. Create OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setStatus(OrderItem.OrderItemStatus.NOT_STARTED);
            orderItem.setCorrespondingOrder(order);
            orderItem.setCorrespondingPlasmid(plasmid);
            orderItemRepository.save(orderItem);

            // 5. Save Fragments/Mutations based on build type
            saveBuildSpecificData(request, plasmid, customer);

            return new OrderResponse(
                    order.getOrderID(),
                    request.getPlasmidName(),
                    order.getDatePlaced(),
                    order.getTotalOrderPrice(),
                    order.getStatus().toString(),
                    "Order created successfully"
            );

        } catch (Exception e) {
            return new OrderResponse(
                    null,
                    request.getPlasmidName(),
                    null,
                    0,
                    "FAILED",
                    "Failed to create order: " + e.getMessage()
            );
        }
    }

    private Plasmid createPlasmidFromRequest(CreateOrderRequest request, Customer customer) {
        Plasmid plasmid;

        switch (request.getBuildType()) {
            case MULTI_INSERT:
                MultiFragment multiFragment = new MultiFragment();
                multiFragment.setPlasmidName(request.getPlasmidName());
                multiFragment.setTotalPlasmidPrice(request.getTotalPrice());
                multiFragment.setDateCreated(new java.sql.Date(System.currentTimeMillis()));
                multiFragment.setIsSaved(false);
                multiFragment.setShopper(customer);
                plasmid = multiFragment;
                break;

            case MUTAGENESIS:
                Mutagenesis mutagenesis = new Mutagenesis();
                mutagenesis.setPlasmidName(request.getPlasmidName());
                mutagenesis.setTotalPlasmidPrice(request.getTotalPrice());
                mutagenesis.setDateCreated(new java.sql.Date(System.currentTimeMillis()));
                mutagenesis.setIsSaved(false);
                mutagenesis.setShopper(customer);
                plasmid = mutagenesis;
                break;

            case NEW_BACKBONE:
                OwnBackbone ownBackbone = new OwnBackbone();
                ownBackbone.setPlasmidName(request.getPlasmidName());
                ownBackbone.setTotalPlasmidPrice(request.getTotalPrice());
                ownBackbone.setDateCreated(new java.sql.Date(System.currentTimeMillis()));
                ownBackbone.setIsSaved(false);
                ownBackbone.setShopper(customer);
                plasmid = ownBackbone;
                break;

            default:
                throw new RuntimeException("Invalid build type");
        }

        return plasmid;
    }

    private void saveBuildSpecificData(CreateOrderRequest request, Plasmid plasmid, Customer customer) {
        switch (request.getBuildType()) {
            case MULTI_INSERT:
            case NEW_BACKBONE:
                // Save fragments
                if (request.getFragments() != null) {
                    for (CreateOrderRequest.FragmentDto fragDto : request.getFragments()) {
                        Fragment fragment = new Fragment();
                        fragment.setSequence(fragDto.getSequence());
                        fragment.setDnaSource(parseDnaSource(fragDto.getDnaType()));
                        fragment.setValid(true);
                        fragment.setToBeOrdered(false);
                        fragment.setIsBackbone(false);
                        fragment.setCustomer(customer);
                        fragmentRepository.save(fragment);
                    }
                }
                break;

            case MUTAGENESIS:
                // Save mutations
                if (request.getMutations() != null && plasmid instanceof Mutagenesis) {
                    Mutagenesis mutagenesis = (Mutagenesis) plasmid;
                    for (String mutationStr : request.getMutations()) {
                        Mutation mutation = new Mutation();
                        mutation.setSequence(mutationStr);
                        mutation.setMutagenesis(mutagenesis);
                        mutationRepository.save(mutation);
                    }
                }
                break;
        }
    }

    private Fragment.DNAsource parseDnaSource(String dnaType) {
        if (dnaType == null) return Fragment.DNAsource.SYNTHETIC;
        
        try {
            return Fragment.DNAsource.valueOf(dnaType.toUpperCase());
        } catch (IllegalArgumentException e) {
            return Fragment.DNAsource.SYNTHETIC;
        }
    }
}
