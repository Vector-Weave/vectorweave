package com.ezvector.backend.dto;

import java.time.OffsetDateTime;
import java.util.List;

public class CartResponse {
    private Integer cartId;
    private List<CartItemDto> items;
    private int totalPrice;
    private int itemCount;

    public static class CartItemDto {
        private Integer cartItemId;
        private String plasmidName;
        private String buildType;
        private String backboneName;
        private int price;
        private OffsetDateTime addedAt;

        public CartItemDto() {}

        public CartItemDto(Integer cartItemId, String plasmidName, String buildType, 
                          String backboneName, int price, OffsetDateTime addedAt) {
            this.cartItemId = cartItemId;
            this.plasmidName = plasmidName;
            this.buildType = buildType;
            this.backboneName = backboneName;
            this.price = price;
            this.addedAt = addedAt;
        }

        // Getters and Setters
        public Integer getCartItemId() {
            return cartItemId;
        }

        public void setCartItemId(Integer cartItemId) {
            this.cartItemId = cartItemId;
        }

        public String getPlasmidName() {
            return plasmidName;
        }

        public void setPlasmidName(String plasmidName) {
            this.plasmidName = plasmidName;
        }

        public String getBuildType() {
            return buildType;
        }

        public void setBuildType(String buildType) {
            this.buildType = buildType;
        }

        public String getBackboneName() {
            return backboneName;
        }

        public void setBackboneName(String backboneName) {
            this.backboneName = backboneName;
        }

        public int getPrice() {
            return price;
        }

        public void setPrice(int price) {
            this.price = price;
        }

        public OffsetDateTime getAddedAt() {
            return addedAt;
        }

        public void setAddedAt(OffsetDateTime addedAt) {
            this.addedAt = addedAt;
        }
    }

    public CartResponse() {}

    // Getters and Setters
    public Integer getCartId() {
        return cartId;
    }

    public void setCartId(Integer cartId) {
        this.cartId = cartId;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }

    public int getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(int totalPrice) {
        this.totalPrice = totalPrice;
    }

    public int getItemCount() {
        return itemCount;
    }

    public void setItemCount(int itemCount) {
        this.itemCount = itemCount;
    }
}
