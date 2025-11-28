package com.backend.porssisahkobak;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors; // Tarvitaan Listan luomiseen

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionRepository subscriptionRepository;

    public SubscriptionController(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    /**
     * UUSI: Vastaa GET-pyyntöihin osoitteessa /api/subscriptions (esim. selaimelta).
     */
    @GetMapping 
    public ResponseEntity<List<String>> getAllSubscriptions() {
        // Hakee kaikki tilaukset ja muuntaa ne lukukelpoiseksi listaksi testausta varten.
        List<String> details = ((List<Subscription>) subscriptionRepository.findAll())
                .stream()
                .map(sub -> sub.getEmail() + " (Raja: " + sub.getThresholdPrice() + " snt/kWh)")
                .collect(Collectors.toList());

        return new ResponseEntity<>(details, HttpStatus.OK);
    }
    
    /**
     * KÄYTETÄÄN REACT NATIVE -SOVELLUKSESSA: Vastaa POST-pyyntöihin osoitteessa /api/subscriptions/subscribe.
     */
    @PostMapping("/subscribe")
    public ResponseEntity<Subscription> createSubscription(@RequestBody Subscription subscription) {
        // Tässä kannattaisi tehdä lisäksi sähköpostin validointi
        Subscription savedSubscription = subscriptionRepository.save(subscription);
        return new ResponseEntity<>(savedSubscription, HttpStatus.CREATED);
    }
    
    // (Valinnainen) Päätepiste tilauksen poistamiseksi
    // @DeleteMapping("/unsubscribe/{id}") ...
}