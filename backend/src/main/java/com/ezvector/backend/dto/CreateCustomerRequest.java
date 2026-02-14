package com.ezvector.backend.dto;

public class CreateCustomerRequest {
    private String supabaseUserId;
    private String email;
    private String firstName;
    private String lastName;

    // Constructors
    public CreateCustomerRequest() {}

    public CreateCustomerRequest(String supabaseUserId, String email, String firstName, String lastName) {
        this.supabaseUserId = supabaseUserId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getters and Setters
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
}
