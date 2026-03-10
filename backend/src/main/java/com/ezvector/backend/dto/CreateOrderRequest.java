package com.ezvector.backend.dto;

import java.util.List;

public class CreateOrderRequest {
    
    public enum BuildType {
        MULTI_INSERT,
        MUTAGENESIS,
        NEW_BACKBONE
    }

    private String supabaseUserId;
    private String plasmidName;
    private BuildType buildType;
    private String backboneName;
    private List<FragmentDto> fragments;
    private List<String> mutations;
    private int totalPrice;

    public static class FragmentDto {
        private String sequence;
        private String dnaType; // "GENOMIC", "PLASMID", "SYNTHETIC"
        
        public FragmentDto() {}
        
        public FragmentDto(String sequence, String dnaType) {
            this.sequence = sequence;
            this.dnaType = dnaType;
        }

        public String getSequence() {
            return sequence;
        }

        public void setSequence(String sequence) {
            this.sequence = sequence;
        }

        public String getDnaType() {
            return dnaType;
        }

        public void setDnaType(String dnaType) {
            this.dnaType = dnaType;
        }
    }

    // Constructors
    public CreateOrderRequest() {}

    // Getters and Setters
    public String getSupabaseUserId() {
        return supabaseUserId;
    }

    public void setSupabaseUserId(String supabaseUserId) {
        this.supabaseUserId = supabaseUserId;
    }

    public String getPlasmidName() {
        return plasmidName;
    }

    public void setPlasmidName(String plasmidName) {
        this.plasmidName = plasmidName;
    }

    public BuildType getBuildType() {
        return buildType;
    }

    public void setBuildType(BuildType buildType) {
        this.buildType = buildType;
    }

    public String getBackboneName() {
        return backboneName;
    }

    public void setBackboneName(String backboneName) {
        this.backboneName = backboneName;
    }

    public List<FragmentDto> getFragments() {
        return fragments;
    }

    public void setFragments(List<FragmentDto> fragments) {
        this.fragments = fragments;
    }

    public List<String> getMutations() {
        return mutations;
    }

    public void setMutations(List<String> mutations) {
        this.mutations = mutations;
    }

    public int getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(int totalPrice) {
        this.totalPrice = totalPrice;
    }
}
