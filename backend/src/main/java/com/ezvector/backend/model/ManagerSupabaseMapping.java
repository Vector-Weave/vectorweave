package com.ezvector.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "manager_supabase_mapping")
public class ManagerSupabaseMapping {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(unique = true, nullable = false)
    private String supabaseUserId;
    
    @Column(nullable = false)
    private Integer managerId;
    
    // Constructors
    public ManagerSupabaseMapping() {}
    
    public ManagerSupabaseMapping(String supabaseUserId, Integer managerId) {
        this.supabaseUserId = supabaseUserId;
        this.managerId = managerId;
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
    
    public Integer getManagerId() {
        return managerId;
    }
    
    public void setManagerId(Integer managerId) {
        this.managerId = managerId;
    }
}
