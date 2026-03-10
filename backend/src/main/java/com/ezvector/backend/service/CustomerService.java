package com.ezvector.backend.service;

import com.ezvector.backend.dto.BackboneDto;
import com.ezvector.backend.dto.CreateCustomerRequest;
import com.ezvector.backend.dto.CustomerResponse;
import com.ezvector.backend.model.Customer;
import com.ezvector.backend.model.CustomerSupabaseMapping;
import com.ezvector.backend.model.Fragment;
import com.ezvector.backend.repository.CustomerRepository;
import com.ezvector.backend.repository.CustomerSupabaseMappingRepository;
import com.ezvector.backend.repository.FragmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerSupabaseMappingRepository mappingRepository;

    @Autowired
    private FragmentRepository fragmentRepository;

    @Transactional
    public CustomerResponse createCustomer(CreateCustomerRequest request) {
        try {
            // Check if Supabase user is already mapped
            if (mappingRepository.existsBySupabaseUserId(request.getSupabaseUserId())) {
                return new CustomerResponse("Customer already exists for this Supabase user");
            }

            // Create new Customer
            Customer customer = new Customer();
            customer.setEmail(request.getEmail());
            customer.setFirstName(request.getFirstName());
            customer.setLastName(request.getLastName());
            customer.setPassword(""); // Password managed by Supabase
            customer.setValid(true);

            // Save customer
            customer = customerRepository.save(customer);

            // Create mapping
            CustomerSupabaseMapping mapping = new CustomerSupabaseMapping(
                request.getSupabaseUserId(),
                customer.getUserID()
            );
            mappingRepository.save(mapping);

            // Return response
            return new CustomerResponse(
                customer.getUserID(),
                request.getSupabaseUserId(),
                customer.getEmail(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getValid()
            );

        } catch (Exception e) {
            return new CustomerResponse("Failed to create customer: " + e.getMessage());
        }
    }

    public CustomerResponse getCustomerBySupabaseId(String supabaseUserId) {
        Optional<CustomerSupabaseMapping> mappingOpt = mappingRepository.findBySupabaseUserId(supabaseUserId);

        if (mappingOpt.isEmpty()) {
            return new CustomerResponse("Customer not found for this Supabase user");
        }

        Optional<Customer> customerOpt = customerRepository.findById(mappingOpt.get().getCustomerId());

        if (customerOpt.isEmpty()) {
            return new CustomerResponse("Customer data not found");
        }

        Customer customer = customerOpt.get();
        return new CustomerResponse(
            customer.getUserID(),
            supabaseUserId,
            customer.getEmail(),
            customer.getFirstName(),
            customer.getLastName(),
            customer.getValid()
        );
    }

    public Optional<Customer> getCustomerEntityBySupabaseId(String supabaseUserId) {
        Optional<CustomerSupabaseMapping> mappingOpt = mappingRepository.findBySupabaseUserId(supabaseUserId);
        
        if (mappingOpt.isEmpty()) {
            return Optional.empty();
        }

        return customerRepository.findById(mappingOpt.get().getCustomerId());
    }

    public List<BackboneDto> getUserBackbones(String supabaseUserId) {
        Optional<Customer> customerOpt = getCustomerEntityBySupabaseId(supabaseUserId);
        
        if (customerOpt.isEmpty()) {
            throw new RuntimeException("Customer not found");
        }

        List<Fragment> backbones = fragmentRepository.findByCustomerAndIsBackbone(customerOpt.get(), true);
        
        return backbones.stream()
                .map(fragment -> new BackboneDto(
                    "Backbone " + fragment.getFragmentID(), // Or use a proper name field if available
                    fragment.getSequence()
                ))
                .collect(Collectors.toList());
    }
}
