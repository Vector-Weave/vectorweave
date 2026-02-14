package com.ezvector.backend.dto;

public class CustomerResponse {
    private Integer customerId;
    private String supabaseUserId;
    private String email;
    private String firstName;
    private String lastName;
    private boolean valid;
    private String message;

    // Constructor for success
    public CustomerResponse(Integer customerId, String supabaseUserId, String email, 
                          String firstName, String lastName, boolean valid) {
        this.customerId = customerId;
        this.supabaseUserId = supabaseUserId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.valid = valid;
    }

    // Constructor for error
    public CustomerResponse(String message) {
        this.message = message;
    }

    // Getters and Setters
    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public String getSupabaseUserId() {
        return supabaseUserId;
    }

    public void setSupabaseUserId(String supabaseUserId) {
        this.supabaseUserId = supabaseUserId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
