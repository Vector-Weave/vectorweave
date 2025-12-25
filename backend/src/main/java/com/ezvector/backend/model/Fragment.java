package com.ezvector.backend.model;/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.35.0.7523.c616a4dce modeling language!*/


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

// line 107 "model.ump"
// line 185 "model.ump"
@Entity
public class Fragment
{

    //------------------------
    // ENUMERATIONS
    //------------------------

    public enum DNAsource { GENOMIC, PLASMID, SYNTHETIC }

    //------------------------
    // MEMBER VARIABLES
    //------------------------
    //Fragment Attributes
    @Id
    @GeneratedValue
    private int fragmentID;
    private DNAsource dnaSource;
    private String sequence;
    private boolean toBeOrdered;
    private boolean valid;
    private boolean isBackbone;

    //Fragment Associations
    @ManyToOne
    private Customer customer;

    //------------------------
    // CONSTRUCTOR
    //------------------------

    public Fragment(int aFragmentID, DNAsource aDnaSource, String aSequence, boolean aToBeOrdered, boolean aValid, boolean aIsBackbone)
    {
        fragmentID = aFragmentID;
        dnaSource = aDnaSource;
        sequence = aSequence;
        toBeOrdered = aToBeOrdered;
        valid = aValid;
        isBackbone = aIsBackbone;
    }

    public Fragment(){}

    //------------------------
    // INTERFACE
    //------------------------

    public boolean setFragmentID(int aFragmentID)
    {
        boolean wasSet = false;
        fragmentID = aFragmentID;
        wasSet = true;
        return wasSet;
    }

    public boolean setDnaSource(DNAsource aDnaSource)
    {
        boolean wasSet = false;
        dnaSource = aDnaSource;
        wasSet = true;
        return wasSet;
    }

    public boolean setSequence(String aSequence)
    {
        boolean wasSet = false;
        sequence = aSequence;
        wasSet = true;
        return wasSet;
    }

    public boolean setToBeOrdered(boolean aToBeOrdered)
    {
        boolean wasSet = false;
        toBeOrdered = aToBeOrdered;
        wasSet = true;
        return wasSet;
    }

    public boolean setValid(boolean aValid)
    {
        boolean wasSet = false;
        valid = aValid;
        wasSet = true;
        return wasSet;
    }

    public boolean setIsBackbone(boolean aIsBackbone)
    {
        boolean wasSet = false;
        isBackbone = aIsBackbone;
        wasSet = true;
        return wasSet;
    }

    public int getFragmentID()
    {
        return fragmentID;
    }

    public DNAsource getDnaSource()
    {
        return dnaSource;
    }

    public String getSequence()
    {
        return sequence;
    }

    public boolean getToBeOrdered()
    {
        return toBeOrdered;
    }

    public boolean getValid()
    {
        return valid;
    }

    public boolean getIsBackbone()
    {
        return isBackbone;
    }
    /* Code from template attribute_IsBoolean */
    public boolean isToBeOrdered()
    {
        return toBeOrdered;
    }
    /* Code from template attribute_IsBoolean */
    public boolean isValid()
    {
        return valid;
    }
    /* Code from template attribute_IsBoolean */
    public boolean isIsBackbone()
    {
        return isBackbone;
    }
    /* Code from template association_GetOne */
    public Customer getCustomer()
    {
        return customer;
    }

    public boolean hasCustomer()
    {
        boolean has = customer != null;
        return has;
    }
    /* Code from template association_SetOptionalOneToMany */
    public boolean setCustomer(Customer aCustomer)
    {
        boolean wasSet = false;
        Customer existingCustomer = customer;
        customer = aCustomer;
        if (existingCustomer != null && !existingCustomer.equals(aCustomer))
        {
            existingCustomer.removeCustomerBackbone(this);
        }
        if (aCustomer != null)
        {
            aCustomer.addCustomerBackbone(this);
        }
        wasSet = true;
        return wasSet;
    }

    public void delete()
    {
        if (customer != null)
        {
            Customer placeholderCustomer = customer;
            this.customer = null;
            placeholderCustomer.removeCustomerBackbone(this);
        }
    }


    public String toString()
    {
        return super.toString() + "["+
                "fragmentID" + ":" + getFragmentID()+ "," +
                "sequence" + ":" + getSequence()+ "," +
                "toBeOrdered" + ":" + getToBeOrdered()+ "," +
                "valid" + ":" + getValid()+ "," +
                "isBackbone" + ":" + getIsBackbone()+ "]" + System.getProperties().getProperty("line.separator") +
                "  " + "dnaSource" + "=" + (getDnaSource() != null ? !getDnaSource().equals(this)  ? getDnaSource().toString().replaceAll("  ","    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
                "  " + "customer = "+(getCustomer()!=null?Integer.toHexString(System.identityHashCode(getCustomer())):"null");
    }
}