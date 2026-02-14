package com.ezvector.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "customer_supabase_mapping")
public class CustomerSupabaseMapping {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(unique = true, nullable = false)
    private String supabaseUserId;
    
    @Column(nullable = false)
    private Integer customerId;
    
    // Constructors
    public CustomerSupabaseMapping() {}
    
    public CustomerSupabaseMapping(String supabaseUserId, Integer customerId) {
        this.supabaseUserId = supabaseUserId;
        this.customerId = customerId;
    }
    
    // Getters and Setters
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getSupabaseUserId() {
        return supabaseUserId;
    }
    
    public void setSupabaseUserId(String supabaseUserId) {
        this.supabaseUserId = supabaseUserId;
    }
    
    public Integer getCustomerId() {
        return customerId;
    }
    
    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }
}
