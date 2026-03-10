package com.ezvector.backend.dto;

public class BackboneDto {
    private String name;
    private String sequence;

    public BackboneDto() {}

    public BackboneDto(String name, String sequence) {
        this.name = name;
        this.sequence = sequence;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSequence() {
        return sequence;
    }

    public void setSequence(String sequence) {
        this.sequence = sequence;
    }
}
