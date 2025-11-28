package com.backend.porssisahkobak;

import com.backend.porssisahkobak.Subscription;
import com.backend.porssisahkobak.SubscriptionRepository;
import com.backend.porssisahkobak.CurrentPrice;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PriceCheckScheduler {

    private static final Logger log = LoggerFactory.getLogger(PriceCheckScheduler.class);
    
    // Injektoidaan tarvittavat palvelut
    private final SubscriptionRepository subscriptionRepository;
    private final CurrentPrice priceFetchingService;
    private final EmailNotificationService emailNotificationService;

    public PriceCheckScheduler(SubscriptionRepository subscriptionRepository,
                               CurrentPrice priceFetchingService,
                               EmailNotificationService emailNotificationService) {
        this.subscriptionRepository = subscriptionRepository;
        this.priceFetchingService = priceFetchingService;
        this.emailNotificationService = emailNotificationService;
    }

    /**
     * Tarkistaa sähkön hinnan ja lähettää ilmoituksia tilaajille.
     * Suoritetaan 15 sekunnin välein testausta varten. Muuten 15 minuutin välein, koska silloin sähkön hinta vaihtuu
     */
    @Scheduled(cron = "*/15 * * * * ?")
    public void checkAndNotify() {
        log.info("--- AJASTETTU HINNANTARKISTUS ALKAA ---");
        
        // 1. Hae nykyinen hinta ulkoisesta API:sta
        double currentPrice = priceFetchingService.getLatestPrice(); 
        log.info("Nykyinen API:sta haettu hinta: {} snt/kWh", currentPrice);

        // 2. Hae tilaajat, joiden rajahinta täyttyy
        // Oletus: Löydä aktiiviset tilaajat, joiden raja (thresholdPrice) on Pienempi Tai Yhtä Suuri kuin nykyinen hinta.
        // Esim. Jos hinta on 6.5, ja tilaajan raja on 5.0, se laukeaa (6.5 >= 5.0).
        List<Subscription> subscriptionsToNotify = 
            subscriptionRepository.findByIsActiveTrueAndThresholdPriceLessThanEqual(currentPrice);
        
        log.info("Löydettiin {} tilaajaa, joille lähetetään varoitus (Current Price: {}).", 
            subscriptionsToNotify.size(), currentPrice);

        // 3. Lähetä ilmoitukset
        for (Subscription sub : subscriptionsToNotify) {
            String subject = "Sähkön hintavaroitus: Raja ylittynyt!";
            String body = String.format(
                "Hei,\n\nSähkön nykyinen hinta on %.2f snt/kWh. Olet asettanut rajaksi %.2f snt/kWh, joka on nyt ylittynyt. " +
                "Älä lämmitä saunaa nyt!", 
                currentPrice, sub.getThresholdPrice()
            );

            // Kutsu sähköpostipalvelua
            emailNotificationService.sendNotification(sub.getEmail(), subject, body);
        }
        
        log.info("--- AJASTETTU HINNANTARKISTUS PÄÄTTYY ---");
    }
}