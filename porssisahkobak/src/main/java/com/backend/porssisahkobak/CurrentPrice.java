package com.backend.porssisahkobak; 

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

@Service
public class CurrentPrice { // Luokan nimi

    private static final Logger log = LoggerFactory.getLogger("PorssisahkoAPI");
    private static final String LATEST_PRICES_ENDPOINT = "https://api.porssisahko.net/v2/latest-prices.json";

    private final RestTemplate restTemplate; // Muutettu 'private RestTemplate restTemplate;' -> 'private final RestTemplate restTemplate;'

    // KORJATTU KONSTRUKTORI: nimi vastaa luokan nimeä, eikä palautustyyppiä (ei void)
    public CurrentPrice() { 
        this.restTemplate = new RestTemplate();
    }

    /**
     * Hakee nykyisen (tämänhetkisen) sähkön hinnan snt/kWh (sis. alv).
     * Jos API-kutsu epäonnistuu tai hintaa ei löydy, palauttaa Double.MAX_VALUE (käytetään korkeana varoitushintana).
     */
    public double getLatestPrice() {
        try {
            // 1. Kutsu ulkoista APIa
            LatestPriceResponse response = restTemplate.getForObject(
                    LATEST_PRICES_ENDPOINT,
                    LatestPriceResponse.class
            );

            // 2. Varmista, että vastauksessa on hintoja
            List<PriceItem> prices = (response != null && response.getPrices() != null) 
                                       ? response.getPrices() 
                                       : Collections.emptyList();

            if (prices.isEmpty()) {
                log.warn("Pörssisähkö.net API palautti tyhjän hintalistan.");
                return Double.MAX_VALUE;
            }

            // 3. Etsi tällä hetkellä voimassa oleva hinta
            Instant now = Instant.now();
            PriceItem currentPriceItem = prices.stream()
                .filter(item -> {
                    Instant start = Instant.parse(item.getStartDate());
                    // Varmistetaan, että verrataan UTC-aikoja (koska API käyttää Z-merkintää)
                    Instant end = Instant.parse(item.getEndDate()).plus(1, ChronoUnit.MILLIS); 
                    
                    return !now.isBefore(start) && now.isBefore(end);
                })
                .findFirst()
                .orElse(null);

            if (currentPriceItem != null) {
                log.info("Nykyinen hinta haettu API:sta: {} snt/kWh", currentPriceItem.getPrice());
                return currentPriceItem.getPrice();
            } else {
                log.warn("Ei löytynyt voimassa olevaa hintatietoa ajankohdalle {}.", now);
                // Jos ei löydy tältä hetkeltä, palauta korkea arvo, jotta ilmoitukset eivät laukea virheellisesti
                return Double.MAX_VALUE;
            }

        } catch (Exception e) {
            log.error("Virhe sähkön hinnan hakemisessa Pörssisähkö.net API:sta: {}", e.getMessage());
            // Virhetilanteessa palautetaan korkea arvo, jotta ei lähetetä virheellisiä varoituksia
            return Double.MAX_VALUE; 
        }
    }

    // --- Sisäiset luokat JSON-vastauksen käsittelyyn ---

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LatestPriceResponse {
        private List<PriceItem> prices;

        public List<PriceItem> getPrices() { return prices; }
        public void setPrices(List<PriceItem> prices) { this.prices = prices; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PriceItem {
        private double price;
        private String startDate;
        private String endDate;

        // Koska hintatiedoissa on propertyt pienellä kirjaimella
        @JsonProperty("price")
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }

        @JsonProperty("startDate")
        public String getStartDate() { return startDate; }
        public void setStartDate(String startDate) { this.startDate = startDate; }

        @JsonProperty("endDate")
        public String getEndDate() { return endDate; }
        public void setEndDate(String endDate) { this.endDate = endDate; }
    }
}
