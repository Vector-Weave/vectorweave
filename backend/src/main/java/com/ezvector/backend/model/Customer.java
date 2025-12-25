package com.ezvector.backend.model;/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.35.0.7523.c616a4dce modeling language!*/


import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;

import java.time.OffsetDateTime;
import java.util.*;
import java.sql.Date;

// line 10 "model.ump"
// line 135 "model.ump"
@Entity
public class Customer extends Person {

    //------------------------
    // MEMBER VARIABLES
    //------------------------

    //Customer Attributes
    private boolean valid;

    //Customer Associations
    @OneToOne
    private Address deliveryAddress;
    @OneToMany
    private List<Plasmid> customerCart;
    @OneToMany
    private List<Order> customerOrders;
    @OneToMany
    private List<Fragment> customerBackbones;

    //------------------------
    // CONSTRUCTOR
    //------------------------

    public Customer(int aUserID, String aEmail, String aPassword, String aFirstName, String aLastName, boolean aValid) {
        super(aUserID, aEmail, aPassword, aFirstName, aLastName);
        valid = aValid;
        customerCart = new ArrayList<Plasmid>();
        customerOrders = new ArrayList<Order>();
        customerBackbones = new ArrayList<Fragment>();
    }

    public Customer() {
    }

    //------------------------
    // INTERFACE
    //------------------------

    public boolean setValid(boolean aValid) {
        boolean wasSet = false;
        valid = aValid;
        wasSet = true;
        return wasSet;
    }

    public boolean getValid() {
        return valid;
    }

    /* Code from template attribute_IsBoolean */
    public boolean isValid() {
        return valid;
    }

    /* Code from template association_GetOne */
    public Address getDeliveryAddress() {
        return deliveryAddress;
    }

    public boolean hasDeliveryAddress() {
        boolean has = deliveryAddress != null;
        return has;
    }

    /* Code from template association_GetMany */
    public Plasmid getCustomerCart(int index) {
        Plasmid aCustomerCart = customerCart.get(index);
        return aCustomerCart;
    }

    public List<Plasmid> getCustomerCart() {
        List<Plasmid> newCustomerCart = Collections.unmodifiableList(customerCart);
        return newCustomerCart;
    }

    public int numberOfCustomerCart() {
        int number = customerCart.size();
        return number;
    }

    public boolean hasCustomerCart() {
        boolean has = customerCart.size() > 0;
        return has;
    }

    public int indexOfCustomerCart(Plasmid aCustomerCart) {
        int index = customerCart.indexOf(aCustomerCart);
        return index;
    }

    /* Code from template association_GetMany */
    public Order getCustomerOrder(int index) {
        Order aCustomerOrder = customerOrders.get(index);
        return aCustomerOrder;
    }

    public List<Order> getCustomerOrders() {
        List<Order> newCustomerOrders = Collections.unmodifiableList(customerOrders);
        return newCustomerOrders;
    }

    public int numberOfCustomerOrders() {
        int number = customerOrders.size();
        return number;
    }

    public boolean hasCustomerOrders() {
        boolean has = customerOrders.size() > 0;
        return has;
    }

    public int indexOfCustomerOrder(Order aCustomerOrder) {
        int index = customerOrders.indexOf(aCustomerOrder);
        return index;
    }

    /* Code from template association_GetMany */
    public Fragment getCustomerBackbone(int index) {
        Fragment aCustomerBackbone = customerBackbones.get(index);
        return aCustomerBackbone;
    }

    public List<Fragment> getCustomerBackbones() {
        List<Fragment> newCustomerBackbones = Collections.unmodifiableList(customerBackbones);
        return newCustomerBackbones;
    }

    public int numberOfCustomerBackbones() {
        int number = customerBackbones.size();
        return number;
    }

    public boolean hasCustomerBackbones() {
        boolean has = customerBackbones.size() > 0;
        return has;
    }

    public int indexOfCustomerBackbone(Fragment aCustomerBackbone) {
        int index = customerBackbones.indexOf(aCustomerBackbone);
        return index;
    }

    /* Code from template association_SetUnidirectionalOptionalOne */
    public boolean setDeliveryAddress(Address aNewDeliveryAddress) {
        boolean wasSet = false;
        deliveryAddress = aNewDeliveryAddress;
        wasSet = true;
        return wasSet;
    }

    /* Code from template association_MinimumNumberOfMethod */
    public static int minimumNumberOfCustomerCart() {
        return 0;
    }

    /* Code from template association_AddManyToOptionalOne */
    public boolean addCustomerCart(Plasmid aCustomerCart) {
        boolean wasAdded = false;
        if (customerCart.contains(aCustomerCart)) {
            return false;
        }
        Customer existingShopper = aCustomerCart.getShopper();
        if (existingShopper == null) {
            aCustomerCart.setShopper(this);
        } else if (!this.equals(existingShopper)) {
            existingShopper.removeCustomerCart(aCustomerCart);
            addCustomerCart(aCustomerCart);
        } else {
            customerCart.add(aCustomerCart);
        }
        wasAdded = true;
        return wasAdded;
    }

    public boolean removeCustomerCart(Plasmid aCustomerCart) {
        boolean wasRemoved = false;
        if (customerCart.contains(aCustomerCart)) {
            customerCart.remove(aCustomerCart);
            aCustomerCart.setShopper(null);
            wasRemoved = true;
        }
        return wasRemoved;
    }

    /* Code from template association_AddIndexControlFunctions */
    public boolean addCustomerCartAt(Plasmid aCustomerCart, int index) {
        boolean wasAdded = false;
        if (addCustomerCart(aCustomerCart)) {
            if (index < 0) {
                index = 0;
            }
            if (index > numberOfCustomerCart()) {
                index = numberOfCustomerCart() - 1;
            }
            customerCart.remove(aCustomerCart);
            customerCart.add(index, aCustomerCart);
            wasAdded = true;
        }
        return wasAdded;
    }

    public boolean addOrMoveCustomerCartAt(Plasmid aCustomerCart, int index) {
        boolean wasAdded = false;
        if (customerCart.contains(aCustomerCart)) {
            if (index < 0) {
                index = 0;
            }
            if (index > numberOfCustomerCart()) {
                index = numberOfCustomerCart() - 1;
            }
            customerCart.remove(aCustomerCart);
            customerCart.add(index, aCustomerCart);
            wasAdded = true;
        } else {
            wasAdded = addCustomerCartAt(aCustomerCart, index);
        }
        return wasAdded;
    }

    /* Code from template association_MinimumNumberOfMethod */
    public static int minimumNumberOfCustomerOrders() {
        return 0;
    }

    /* Code from template association_AddManyToOne */
    public Order addCustomerOrder(int aOrderID, OffsetDateTime aDatePlaced, Date aDateReceived, int aTotalOrderPrice, Order.OrderStatus aStatus) {
        return new Order(aOrderID, aDatePlaced, aDateReceived, aTotalOrderPrice, aStatus, this);
    }

    public boolean addCustomerOrder(Order aCustomerOrder) {
        boolean wasAdded = false;
        if (customerOrders.contains(aCustomerOrder)) {
            return false;
        }
        Customer existingCustomerOrdering = aCustomerOrder.getCustomerOrdering();
        boolean isNewCustomerOrdering = existingCustomerOrdering != null && !this.equals(existingCustomerOrdering);
        if (isNewCustomerOrdering) {
            aCustomerOrder.setCustomerOrdering(this);
        } else {
            customerOrders.add(aCustomerOrder);
        }
        wasAdded = true;
        return wasAdded;
    }

    public boolean removeCustomerOrder(Order aCustomerOrder) {
        boolean wasRemoved = false;
        //Unable to remove aCustomerOrder, as it must always have a customerOrdering
        if (!this.equals(aCustomerOrder.getCustomerOrdering())) {
            customerOrders.remove(aCustomerOrder);
            wasRemoved = true;
        }
        return wasRemoved;
    }

    /* Code from template association_AddIndexControlFunctions */
    public boolean addCustomerOrderAt(Order aCustomerOrder, int index) {
        boolean wasAdded = false;
        if (addCustomerOrder(aCustomerOrder)) {
            if (index < 0) {
                index = 0;
            }
            if (index > numberOfCustomerOrders()) {
                index = numberOfCustomerOrders() - 1;
            }
            customerOrders.remove(aCustomerOrder);
            customerOrders.add(index, aCustomerOrder);
            wasAdded = true;
        }
        return wasAdded;
    }

    public boolean addOrMoveCustomerOrderAt(Order aCustomerOrder, int index) {
        boolean wasAdded = false;
        if (customerOrders.contains(aCustomerOrder)) {
            if (index < 0) {
                index = 0;
            }
            if (index > numberOfCustomerOrders()) {
                index = numberOfCustomerOrders() - 1;
            }
            customerOrders.remove(aCustomerOrder);
            customerOrders.add(index, aCustomerOrder);
            wasAdded = true;
        } else {
            wasAdded = addCustomerOrderAt(aCustomerOrder, index);
        }
        return wasAdded;
    }

    /* Code from template association_MinimumNumberOfMethod */
    public static int minimumNumberOfCustomerBackbones() {
        return 0;
    }

    /* Code from template association_AddManyToOptionalOne */
    public boolean addCustomerBackbone(Fragment aCustomerBackbone) {
        boolean wasAdded = false;
        if (customerBackbones.contains(aCustomerBackbone)) {
            return false;
        }
        Customer existingCustomer = aCustomerBackbone.getCustomer();
        if (existingCustomer == null) {
            aCustomerBackbone.setCustomer(this);
        } else if (!this.equals(existingCustomer)) {
            existingCustomer.removeCustomerBackbone(aCustomerBackbone);
            addCustomerBackbone(aCustomerBackbone);
        } else {
            customerBackbones.add(aCustomerBackbone);
        }
        wasAdded = true;
        return wasAdded;
    }

    public boolean removeCustomerBackbone(Fragment aCustomerBackbone) {
        boolean wasRemoved = false;
        if (customerBackbones.contains(aCustomerBackbone)) {
            customerBackbones.remove(aCustomerBackbone);
            aCustomerBackbone.setCustomer(null);
            wasRemoved = true;
        }
        return wasRemoved;
    }

    /* Code from template association_AddIndexControlFunctions */
    public boolean addCustomerBackboneAt(Fragment aCustomerBackbone, int index) {
        boolean wasAdded = false;
        if (addCustomerBackbone(aCustomerBackbone)) {
            if (index < 0) {
                index = 0;
            }
            if (index > numberOfCustomerBackbones()) {
                index = numberOfCustomerBackbones() - 1;
            }
            customerBackbones.remove(aCustomerBackbone);
            customerBackbones.add(index, aCustomerBackbone);
            wasAdded = true;
        }
        return wasAdded;
    }

    public boolean addOrMoveCustomerBackboneAt(Fragment aCustomerBackbone, int index) {
        boolean wasAdded = false;
        if (customerBackbones.contains(aCustomerBackbone)) {
            if (index < 0) {
                index = 0;
            }
            if (index > numberOfCustomerBackbones()) {
                index = numberOfCustomerBackbones() - 1;
            }
            customerBackbones.remove(aCustomerBackbone);
            customerBackbones.add(index, aCustomerBackbone);
            wasAdded = true;
        } else {
            wasAdded = addCustomerBackboneAt(aCustomerBackbone, index);
        }
        return wasAdded;
    }

    public void delete() {
        deliveryAddress = null;
        while (!customerCart.isEmpty()) {
            customerCart.get(0).setShopper(null);
        }
        for (int i = customerOrders.size(); i > 0; i--) {
            Order aCustomerOrder = customerOrders.get(i - 1);
            aCustomerOrder.delete();
        }
        while (!customerBackbones.isEmpty()) {
            customerBackbones.get(0).setCustomer(null);
        }
        super.delete();
    }

    // line 15 "model.ump"
    public void method1() {
        /* Implementation */
    }


    public String toString() {
        return super.toString() + "[" +
                "valid" + ":" + getValid() + "]" + System.getProperties().getProperty("line.separator") +
                "  " + "deliveryAddress = " + (getDeliveryAddress() != null ? Integer.toHexString(System.identityHashCode(getDeliveryAddress())) : "null");
    }
}