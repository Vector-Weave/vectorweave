package com.ezvector.backend.model;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer cartItemId;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @Column(name = "plasmid_name")
    private String plasmidName;

    @Column(name = "build_type")
    private String buildType; // MULTI_INSERT, MUTAGENESIS, NEW_BACKBONE

    @Column(name = "backbone_name")
    private String backboneName;

    @Column(name = "fragments_data", columnDefinition = "TEXT")
    private String fragmentsData; // JSON string

    @Column(name = "mutations_data", columnDefinition = "TEXT")
    private String mutationsData; // JSON string

    @Column(name = "price")
    private int price;

    @Column(name = "added_at")
    private OffsetDateTime addedAt;

    public CartItem() {
        this.addedAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public Integer getCartItemId() {
        return cartItemId;
    }

    public void setCartItemId(Integer cartItemId) {
        this.cartItemId = cartItemId;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
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

    public String getFragmentsData() {
        return fragmentsData;
    }

    public void setFragmentsData(String fragmentsData) {
        this.fragmentsData = fragmentsData;
    }

    public String getMutationsData() {
        return mutationsData;
    }

    public void setMutationsData(String mutationsData) {
        this.mutationsData = mutationsData;
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
