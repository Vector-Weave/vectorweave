package com.ezvector.backend.controller;

import com.ezvector.backend.dto.CreateCustomerRequest;
import com.ezvector.backend.dto.CustomerResponse;
import com.ezvector.backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(@RequestBody CreateCustomerRequest request) {
        CustomerResponse response = customerService.createCustomer(request);
        
        if (response.getCustomerId() == null) {
            return ResponseEntity.badRequest().body(response);
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/supabase/{supabaseUserId}")
    public ResponseEntity<CustomerResponse> getCustomerBySupabaseId(@PathVariable String supabaseUserId) {
        CustomerResponse response = customerService.getCustomerBySupabaseId(supabaseUserId);
        
        if (response.getCustomerId() == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Customer endpoint is working!");
    }

    @GetMapping("/backbones/{supabaseUserId}")
    public ResponseEntity<?> getUserBackbones(@PathVariable String supabaseUserId) {
        try {
            var backbones = customerService.getUserBackbones(supabaseUserId);
            return ResponseEntity.ok(backbones);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch backbones: " + e.getMessage());
        }
    }
}
