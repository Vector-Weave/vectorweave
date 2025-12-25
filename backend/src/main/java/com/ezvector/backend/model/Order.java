package com.ezvector.backend.model;/*PLEASE DO NOT EDIT THIS CODE*/
/*This code was generated using the UMPLE 1.35.0.7523.c616a4dce modeling language!*/


import jakarta.persistence.*;

import java.sql.Date;
import java.time.OffsetDateTime;
import java.time.OffsetTime;
import java.util.*;

// line 41 "model.ump"
// line 140 "model.ump"
@Entity
@Table(name = "orders")
public class Order {

    //------------------------
    // ENUMERATIONS
    //------------------------

    public enum OrderStatus {NOT_STARTED, IN_PROGRESS, COMPLETE}

    //------------------------
    // MEMBER VARIABLES
    //------------------------

    //Order Attributes
    @Id
    @GeneratedValue
    private int orderID;
    @Column(name = "date_placed", columnDefinition = "TIMESTAMPTZ")
    private OffsetDateTime datePlaced;
    @Temporal(TemporalType.DATE)
    private Date dateReceived;
    private int totalOrderPrice;
    private OrderStatus status;

    //Order Associations
    @ManyToOne
    private Customer customerOrdering;
    @OneToMany
    private List<OrderItem> orderItems;

    //------------------------
    // CONSTRUCTOR
    //------------------------

    public Order(int aOrderID, OffsetDateTime aDatePlaced, Date aDateReceived, int aTotalOrderPrice, OrderStatus aStatus, Customer aCustomerOrdering) {
        orderID = aOrderID;
        datePlaced = aDatePlaced;
        dateReceived = aDateReceived;
        totalOrderPrice = aTotalOrderPrice;
        status = aStatus;
        boolean didAddCustomerOrdering = setCustomerOrdering(aCustomerOrdering);
        if (!didAddCustomerOrdering) {
            throw new RuntimeException("Unable to create customerOrder due to customerOrdering. See https://manual.umple.org?RE002ViolationofAssociationMultiplicity.html");
        }
        orderItems = new ArrayList<OrderItem>();
    }

    public Order() {
    }

    //------------------------
    // INTERFACE
    //------------------------

    public boolean setOrderID(int aOrderID) {
        boolean wasSet = false;
        orderID = aOrderID;
        wasSet = true;
        return wasSet;
    }

    public boolean setDatePlaced(OffsetDateTime aDatePlaced) {
        boolean wasSet = false;
        datePlaced = aDatePlaced;
        wasSet = true;
        return wasSet;
    }

    public boolean setDateReceived(Date aDateReceived) {
        boolean wasSet = false;
        dateReceived = aDateReceived;
        wasSet = true;
        return wasSet;
    }

    public boolean setTotalOrderPrice(int aTotalOrderPrice) {
        boolean wasSet = false;
        totalOrderPrice = aTotalOrderPrice;
        wasSet = true;
        return wasSet;
    }

    public boolean setStatus(OrderStatus aStatus) {
        boolean wasSet = false;
        status = aStatus;
        wasSet = true;
        return wasSet;
    }

    public int getOrderID() {
        return orderID;
    }

    public OffsetDateTime getDatePlaced() {
        return datePlaced;
    }

    public Date getDateReceived() {
        return dateReceived;
    }

    public int getTotalOrderPrice() {
        return totalOrderPrice;
    }

    public OrderStatus getStatus() {
        return status;
    }

    /* Code from template association_GetOne */
    public Customer getCustomerOrdering() {
        return customerOrdering;
    }

    /* Code from template association_GetMany */
    public OrderItem getOrderItem(int index) {
        OrderItem aOrderItem = orderItems.get(index);
        return aOrderItem;
    }

    public List<OrderItem> getOrderItems() {
        List<OrderItem> newOrderItems = Collections.unmodifiableList(orderItems);
        return newOrderItems;
    }

    public int numberOfOrderItems() {
        int number = orderItems.size();
        return number;
    }

    public boolean hasOrderItems() {
        boolean has = orderItems.size() > 0;
        return has;
    }

    public int indexOfOrderItem(OrderItem aOrderItem) {
        int index = orderItems.indexOf(aOrderItem);
        return index;
    }

    /* Code from template association_SetOneToMany */
    public boolean setCustomerOrdering(Customer aCustomerOrdering) {
        boolean wasSet = false;
        if (aCustomerOrdering == null) {
            return wasSet;
        }

        Customer existingCustomerOrdering = customerOrdering;
        customerOrdering = aCustomerOrdering;
        if (existingCustomerOrdering != null && !existingCustomerOrdering.equals(aCustomerOrdering)) {
            existingCustomerOrdering.removeCustomerOrder(this);
        }
        customerOrdering.addCustomerOrder(this);
        wasSet = true;
        return wasSet;
    }

    /* Code from template association_IsNumberOfValidMethod */
    public boolean isNumberOfOrderItemsValid() {
        boolean isValid = numberOfOrderItems() >= minimumNumberOfOrderItems();
        return isValid;
    }

    /* Code from template association_MinimumNumberOfMethod */
    public static int minimumNumberOfOrderItems() {
        return 1;
    }

    /* Code from template association_AddMandatoryManyToOne */
    public OrderItem addOrderItem(int aOrderItemID, OrderItem.OrderItemStatus aStatus, Plasmid aCorrespondingPlasmid) {
        OrderItem aNewOrderItem = new OrderItem(aOrderItemID, aStatus, this, aCorrespondingPlasmid);
        return aNewOrderItem;
    }

    public boolean addOrderItem(OrderItem aOrderItem) {
        boolean wasAdded = false;
        if (orderItems.contains(aOrderItem)) {
            return false;
        }
        Order existingCorrespondingOrder = aOrderItem.getCorrespondingOrder();
        boolean isNewCorrespondingOrder = existingCorrespondingOrder != null && !this.equals(existingCorrespondingOrder);

        if (isNewCorrespondingOrder && existingCorrespondingOrder.numberOfOrderItems() <= minimumNumberOfOrderItems()) {
            return wasAdded;
        }
        if (isNewCorrespondingOrder) {
            aOrderItem.setCorrespondingOrder(this);
        } else {
            orderItems.add(aOrderItem);
        }
        wasAdded = true;
        return wasAdded;
    }

    public boolean removeOrderItem(OrderItem aOrderItem) {
        boolean wasRemoved = false;
        //Unable to remove aOrderItem, as it must always have a correspondingOrder
        if (this.equals(aOrderItem.getCorrespondingOrder())) {
            return wasRemoved;
        }

        //correspondingOrder already at minimum (1)
        if (numberOfOrderItems() <= minimumNumberOfOrderItems()) {
            return wasRemoved;
        }

        orderItems.remove(aOrderItem);
        wasRemoved = true;
        return wasRemoved;
    }

    /* Code from template association_AddIndexControlFunctions */
    public boolean addOrderItemAt(OrderItem aOrderItem, int index) {
        boolean wasAdded = false;
        if (addOrderItem(aOrderItem)) {
            if (index < 0) {
                index = 0;
            }
            if (index > numberOfOrderItems()) {
                index = numberOfOrderItems() - 1;
            }
            orderItems.remove(aOrderItem);
            orderItems.add(index, aOrderItem);
            wasAdded = true;
        }
        return wasAdded;
    }

    public boolean addOrMoveOrderItemAt(OrderItem aOrderItem, int index) {
        boolean wasAdded = false;
        if (orderItems.contains(aOrderItem)) {
            if (index < 0) {
                index = 0;
            }
            if (index > numberOfOrderItems()) {
                index = numberOfOrderItems() - 1;
            }
            orderItems.remove(aOrderItem);
            orderItems.add(index, aOrderItem);
            wasAdded = true;
        } else {
            wasAdded = addOrderItemAt(aOrderItem, index);
        }
        return wasAdded;
    }

    public void delete() {
        Customer placeholderCustomerOrdering = customerOrdering;
        this.customerOrdering = null;
        if (placeholderCustomerOrdering != null) {
            placeholderCustomerOrdering.removeCustomerOrder(this);
        }
        for (int i = orderItems.size(); i > 0; i--) {
            OrderItem aOrderItem = orderItems.get(i - 1);
            aOrderItem.delete();
        }
    }


    public String toString() {
        return super.toString() + "[" +
                "orderID" + ":" + getOrderID() + "," +
                "totalOrderPrice" + ":" + getTotalOrderPrice() + "]" + System.getProperties().getProperty("line.separator") +
                "  " + "datePlaced" + "=" + (getDatePlaced() != null ? !getDatePlaced().equals(this) ? getDatePlaced().toString().replaceAll("  ", "    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
                "  " + "dateReceived" + "=" + (getDateReceived() != null ? !getDateReceived().equals(this) ? getDateReceived().toString().replaceAll("  ", "    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
                "  " + "status" + "=" + (getStatus() != null ? !getStatus().equals(this) ? getStatus().toString().replaceAll("  ", "    ") : "this" : "null") + System.getProperties().getProperty("line.separator") +
                "  " + "customerOrdering = " + (getCustomerOrdering() != null ? Integer.toHexString(System.identityHashCode(getCustomerOrdering())) : "null");
    }
}