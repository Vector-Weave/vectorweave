package com.ezvector.backend.model;/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.35.0.7523.c616a4dce modeling language!*/


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

// line 103 "model.ump"
// line 180 "model.ump"
@Entity
public class Mutation {

    //------------------------
    // MEMBER VARIABLES
    //------------------------

    //Mutation Attributes
    @Id
    @GeneratedValue
    private int mutationId;
    private String sequence;

    //Mutation Associations
    @ManyToOne
    private Mutagenesis mutagenesis;

    //------------------------
    // CONSTRUCTOR
    //------------------------

    public Mutation(String aSequence, Mutagenesis aMutagenesis) {
        sequence = aSequence;
        boolean didAddMutagenesis = setMutagenesis(aMutagenesis);
        if (!didAddMutagenesis) {
            throw new RuntimeException("Unable to create mutation due to mutagenesis. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
        }
    }

    public Mutation() {
    }

    //------------------------
    // INTERFACE
    //------------------------

    public boolean setSequence(String aSequence) {
        boolean wasSet = false;
        sequence = aSequence;
        wasSet = true;
        return wasSet;
    }

    public int getMutationId() {
        return mutationId;
    }

    public String getSequence() {
        return sequence;
    }

    /* Code from template association_GetOne */
    public Mutagenesis getMutagenesis() {
        return mutagenesis;
    }

    /* Code from template association_SetOneToAtMostN */
    public boolean setMutagenesis(Mutagenesis aMutagenesis) {
        boolean wasSet = false;
        //Must provide mutagenesis to mutation
        if (aMutagenesis == null) {
            return wasSet;
        }

        //mutagenesis already at maximum (5)
        if (aMutagenesis.numberOfMutations() >= Mutagenesis.maximumNumberOfMutations()) {
            return wasSet;
        }

        Mutagenesis existingMutagenesis = mutagenesis;
        mutagenesis = aMutagenesis;
        if (existingMutagenesis != null && !existingMutagenesis.equals(aMutagenesis)) {
            boolean didRemove = existingMutagenesis.removeMutation(this);
            if (!didRemove) {
                mutagenesis = existingMutagenesis;
                return wasSet;
            }
        }
        mutagenesis.addMutation(this);
        wasSet = true;
        return wasSet;
    }

    public void delete() {
        Mutagenesis placeholderMutagenesis = mutagenesis;
        this.mutagenesis = null;
        if (placeholderMutagenesis != null) {
            placeholderMutagenesis.removeMutation(this);
        }
    }


    public String toString() {
        return super.toString() + "[" +
                "sequence" + ":" + getSequence() + "]" + System.getProperties().getProperty("line.separator") +
                "  " + "mutagenesis = " + (getMutagenesis() != null ? Integer.toHexString(System.identityHashCode(getMutagenesis())) : "null");
    }
}