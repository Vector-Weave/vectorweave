package com.ezvector.backend.dto;

import java.time.OffsetDateTime;

public class OrderResponse {
    private Integer orderId;
    private String plasmidName;
    private OffsetDateTime datePlaced;
    private int totalPrice;
    private String status;
    private String message;

    public OrderResponse() {}

    public OrderResponse(Integer orderId, String plasmidName, OffsetDateTime datePlaced, 
                        int totalPrice, String status, String message) {
        this.orderId = orderId;
        this.plasmidName = plasmidName;
        this.datePlaced = datePlaced;
        this.totalPrice = totalPrice;
        this.status = status;
        this.message = message;
    }

    // Getters and Setters
    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public String getPlasmidName() {
        return plasmidName;
    }

    public void setPlasmidName(String plasmidName) {
        this.plasmidName = plasmidName;
    }

    public OffsetDateTime getDatePlaced() {
        return datePlaced;
    }

    public void setDatePlaced(OffsetDateTime datePlaced) {
        this.datePlaced = datePlaced;
    }

    public int getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(int totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
