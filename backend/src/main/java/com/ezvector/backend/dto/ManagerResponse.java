package com.ezvector.backend.dto;

public class ManagerResponse {
    private Integer managerId;
    private String supabaseUserId;
    private String email;
    private String firstName;
    private String lastName;
    private String message;

    // Constructor for success
    public ManagerResponse(Integer managerId, String supabaseUserId, String email, 
                          String firstName, String lastName) {
        this.managerId = managerId;
        this.supabaseUserId = supabaseUserId;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Constructor for error
    public ManagerResponse(String message) {
        this.message = message;
    }

    // Getters and Setters
    public Integer getManagerId() {
        return managerId;
    }

    public void setManagerId(Integer managerId) {
        this.managerId = managerId;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
