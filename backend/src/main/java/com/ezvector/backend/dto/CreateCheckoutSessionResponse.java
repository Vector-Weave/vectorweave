package com.ezvector.backend.dto;

public class CreateCheckoutSessionResponse {
    private String sessionId;
    private String url;

    public CreateCheckoutSessionResponse() {}

    public CreateCheckoutSessionResponse(String sessionId, String url) {
        this.sessionId = sessionId;
        this.url = url;
    }

    // Getters and Setters
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
