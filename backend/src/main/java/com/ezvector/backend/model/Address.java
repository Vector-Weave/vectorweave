package com.ezvector.backend.model;/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.35.0.7523.c616a4dce modeling language!*/


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

// line 33 "model.ump"
// line 125 "model.ump"
@Entity
public class Address {

    //------------------------
    // MEMBER VARIABLES
    //------------------------

    //Address Attributes
    @Id
    @GeneratedValue
    private int addressId;
    private String street;
    private String city;
    private String state;
    private String zipCode;

    //------------------------
    // CONSTRUCTOR
    //------------------------

    public Address(String aStreet, String aCity, String aState, String aZipCode) {
        street = aStreet;
        city = aCity;
        state = aState;
        zipCode = aZipCode;
    }

    public Address() {
    }

    //------------------------
    // INTERFACE
    //------------------------

    public boolean setStreet(String aStreet) {
        boolean wasSet = false;
        street = aStreet;
        wasSet = true;
        return wasSet;
    }

    public boolean setCity(String aCity) {
        boolean wasSet = false;
        city = aCity;
        wasSet = true;
        return wasSet;
    }

    public boolean setState(String aState) {
        boolean wasSet = false;
        state = aState;
        wasSet = true;
        return wasSet;
    }

    public boolean setZipCode(String aZipCode) {
        boolean wasSet = false;
        zipCode = aZipCode;
        wasSet = true;
        return wasSet;
    }

    public String getStreet() {
        return street;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public int getAddressId() {
        return addressId;
    }

    public void delete() {
    }


    public String toString() {
        return super.toString() + "[" +
                "street" + ":" + getStreet() + "," +
                "city" + ":" + getCity() + "," +
                "state" + ":" + getState() + "," +
                "zipCode" + ":" + getZipCode() + "]";
    }
}