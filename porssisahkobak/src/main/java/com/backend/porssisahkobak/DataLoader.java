package com.backend.porssisahkobak;

import com.backend.porssisahkobak.Subscription;
import com.backend.porssisahkobak.SubscriptionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final SubscriptionRepository subscriptionRepository;

    // Riippuvuuden injektointi (Springin tapa antaa Repository käyttöön)
    public DataLoader(SubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    // run-metodi suoritetaan automaattisesti käynnistyksen jälkeen
    @Override
    public void run(String... args) throws Exception {
        System.out.println("--- Ladataan esimerkkihintoja H2-tietokantaan ---");

        // Esimerkki 1: Herkullinen hinta (varoitus 10.0 snt/kWh ylityksestä)
        Subscription sub1 = new Subscription();
        sub1.setEmail("joku.leppanen@gmail.com");
        sub1.setThresholdPrice(0.1);//10.0 snt/kWh
        sub1.setActive(true);
        subscriptionRepository.save(sub1);

        // Esimerkki 2: Kallis hinta (varoitus 15.5 snt/kWh ylityksestä)
        Subscription sub2 = new Subscription();
        sub2.setEmail("joku.kayttaja2@esimerkki.com");
        sub2.setThresholdPrice(15.5); // 15.5 snt/kWh
        sub2.setActive(true);
        subscriptionRepository.save(sub2);
        
        // Esimerkki 3: Korkea raja, joka tuskin laukeaa (varoitus 50.0 snt/kWh ylityksestä)
        Subscription sub3 = new Subscription();
        sub3.setEmail("joku.kayttaja3@esimerkki.com");
        sub3.setThresholdPrice(50.0); // 50.0 snt/kWh
        sub3.setActive(true);
        subscriptionRepository.save(sub3);
        
        System.out.println("--- 3 tilausta tallennettu onnistuneesti ---");
    }
}