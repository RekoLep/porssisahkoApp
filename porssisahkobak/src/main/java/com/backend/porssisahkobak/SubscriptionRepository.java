package com.backend.porssisahkobak;

import com.backend.porssisahkobak.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    // Etsii kaikki aktiiviset tilaukset, joiden rajahinta on pienempi tai yhtä suuri kuin annettu hinta
    List<Subscription> findByIsActiveTrueAndThresholdPriceLessThanEqual(double currentPrice);
}
