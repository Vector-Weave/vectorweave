package com.ezvector.backend.dto;

import java.util.List;

public class AddToCartRequest {
    private String supabaseUserId;
    private String plasmidName;
    private String buildType;
    private String backboneName;
    private List<FragmentDto> fragments;
    private List<String> mutations;
    private int price;

    public static class FragmentDto {
        private String sequence;
        private String dnaType;

        public FragmentDto() {}

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

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }
}
