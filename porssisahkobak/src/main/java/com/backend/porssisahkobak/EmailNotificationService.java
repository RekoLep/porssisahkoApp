package com.backend.porssisahkobak;

// EmailNotificationService.java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);
    // POISTA JavaMailSender-riippuvuus testauksen ajaksi
    
    // Poista konstruktori, joka ottaa vastaan JavaMailSenderin

    public void sendNotification(String to, String subject, String body) {
        log.warn("--- SIMULOITU SÄHKÖPOSTIN LÄHETYS ---");
        log.warn("Lähetetään osoitteeseen: {}", to);
        log.warn("Aihe: {}", subject);
        log.warn("Runkoteksti: {}", body.replace("\n", " | "));
        log.warn("-------------------------------------");
        // HUOM: Ei kutsu mailSender.send(message) -metodia
    }
}