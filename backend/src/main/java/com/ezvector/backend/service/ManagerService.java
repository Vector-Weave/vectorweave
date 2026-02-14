package com.ezvector.backend.service;

import com.ezvector.backend.dto.ManagerResponse;
import com.ezvector.backend.dto.UpgradeToManagerRequest;
import com.ezvector.backend.model.Customer;
import com.ezvector.backend.model.CustomerSupabaseMapping;
import com.ezvector.backend.model.Manager;
import com.ezvector.backend.model.ManagerSupabaseMapping;
import com.ezvector.backend.repository.CustomerSupabaseMappingRepository;
import com.ezvector.backend.repository.ManagerRepository;
import com.ezvector.backend.repository.ManagerSupabaseMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ManagerService {

    @Autowired
    private ManagerRepository managerRepository;

    @Autowired
    private ManagerSupabaseMappingRepository managerMappingRepository;

    @Autowired
    private CustomerSupabaseMappingRepository customerMappingRepository;

    @Autowired
    private CustomerService customerService;

    @Transactional
    public ManagerResponse upgradeCustomerToManager(UpgradeToManagerRequest request) {
        try {
            String supabaseUserId = request.getSupabaseUserId();

            // Check if already a manager
            if (managerMappingRepository.existsBySupabaseUserId(supabaseUserId)) {
                return new ManagerResponse("User is already a manager");
            }

            // Get customer by Supabase ID
            Optional<Customer> customerOpt = customerService.getCustomerEntityBySupabaseId(supabaseUserId);
            
            if (customerOpt.isEmpty()) {
                return new ManagerResponse("Customer not found for this Supabase user");
            }

            Customer customer = customerOpt.get();

            // Create new Manager with same info as Customer
            Manager manager = new Manager();
            manager.setEmail(customer.getEmail());
            manager.setFirstName(customer.getFirstName());
            manager.setLastName(customer.getLastName());
            manager.setPassword(""); // Password managed by Supabase

            // Save manager
            manager = managerRepository.save(manager);

            // Create mapping
            ManagerSupabaseMapping mapping = new ManagerSupabaseMapping(
                supabaseUserId,
                manager.getUserID()
            );
            managerMappingRepository.save(mapping);

            // Return response
            return new ManagerResponse(
                manager.getUserID(),
                supabaseUserId,
                manager.getEmail(),
                manager.getFirstName(),
                manager.getLastName()
            );

        } catch (Exception e) {
            return new ManagerResponse("Failed to upgrade to manager: " + e.getMessage());
        }
    }

    public ManagerResponse getManagerBySupabaseId(String supabaseUserId) {
        Optional<ManagerSupabaseMapping> mappingOpt = managerMappingRepository.findBySupabaseUserId(supabaseUserId);

        if (mappingOpt.isEmpty()) {
            return new ManagerResponse("Manager not found for this Supabase user");
        }

        Optional<Manager> managerOpt = managerRepository.findById(mappingOpt.get().getManagerId());

        if (managerOpt.isEmpty()) {
            return new ManagerResponse("Manager data not found");
        }

        Manager manager = managerOpt.get();
        return new ManagerResponse(
            manager.getUserID(),
            supabaseUserId,
            manager.getEmail(),
            manager.getFirstName(),
            manager.getLastName()
        );
    }

    public boolean isManager(String supabaseUserId) {
        return managerMappingRepository.existsBySupabaseUserId(supabaseUserId);
    }
}
