package com.ezvector.backend.dto;

public class UpgradeToManagerRequest {
    private String supabaseUserId;

    // Constructors
    public UpgradeToManagerRequest() {}

    public UpgradeToManagerRequest(String supabaseUserId) {
        this.supabaseUserId = supabaseUserId;
    }

    // Getters and Setters
    public String getSupabaseUserId() {
        return supabaseUserId;
    }

    public void setSupabaseUserId(String supabaseUserId) {
        this.supabaseUserId = supabaseUserId;
    }
}
