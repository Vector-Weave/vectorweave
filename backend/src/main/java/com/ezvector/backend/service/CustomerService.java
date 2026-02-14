package com.ezvector.backend.service;

import com.ezvector.backend.dto.CreateCustomerRequest;
import com.ezvector.backend.dto.CustomerResponse;
import com.ezvector.backend.model.Customer;
import com.ezvector.backend.model.CustomerSupabaseMapping;
import com.ezvector.backend.repository.CustomerRepository;
import com.ezvector.backend.repository.CustomerSupabaseMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CustomerSupabaseMappingRepository mappingRepository;

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
}
