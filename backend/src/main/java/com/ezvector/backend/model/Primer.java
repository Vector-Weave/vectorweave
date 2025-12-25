package com.ezvector.backend.model;/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.35.0.7523.c616a4dce modeling language!*/


import jakarta.persistence.*;

// line 68 "model.ump"
// line 155 "model.ump"
@Entity
public class Primer {

    //------------------------
    // MEMBER VARIABLES
    //------------------------
    @Id
    @GeneratedValue
    private int primerId;

    //Primer Associations
    @ManyToOne
    private Plasmid plasmid;

    //------------------------
    // CONSTRUCTOR
    //------------------------

    public Primer(Plasmid aPlasmid) {
        boolean didAddPlasmid = setPlasmid(aPlasmid);
        if (!didAddPlasmid) {
            throw new RuntimeException("Unable to create primer due to plasmid. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
        }
    }

    public Primer() {
    }

    //------------------------
    // INTERFACE
    //------------------------
    /* Code from template association_GetOne */
    public Plasmid getPlasmid() {
        return plasmid;
    }

    /* Code from template association_SetOneToMany */
    public boolean setPlasmid(Plasmid aPlasmid) {
        boolean wasSet = false;
        if (aPlasmid == null) {
            return wasSet;
        }

        Plasmid existingPlasmid = plasmid;
        plasmid = aPlasmid;
        if (existingPlasmid != null && !existingPlasmid.equals(aPlasmid)) {
            existingPlasmid.removePrimer(this);
        }
        plasmid.addPrimer(this);
        wasSet = true;
        return wasSet;
    }

    public void delete() {
        Plasmid placeholderPlasmid = plasmid;
        this.plasmid = null;
        if (placeholderPlasmid != null) {
            placeholderPlasmid.removePrimer(this);
        }
    }

}