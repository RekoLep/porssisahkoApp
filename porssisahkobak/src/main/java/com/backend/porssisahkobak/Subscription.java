package com.backend.porssisahkobak;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private double thresholdPrice; // Rajahinta snt/kWh
    private boolean isActive = true;

    // Getters and setters, constructors
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public double getThresholdPrice() {
        return thresholdPrice;
    }

    public void setThresholdPrice(double thresholdPrice) {
        this.thresholdPrice = thresholdPrice;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}

