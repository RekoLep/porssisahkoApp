package com.backend.porssisahkobak;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Salli CORS kaikille /api -päätepisteille
            .allowedOrigins(
                "http://192.168.19.45:8081",
                "http://localhost:8081", // iOS Simulaattori
                "http://127.0.0.1:8081", // iOS Simulaattori
                "http://10.0.2.2:8081",  // Android Emulaattori
                "http://192.168.X.X"     // Laita tähän tietokoneesi IP, jos käytät fyysistä puhelinta.
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*");
    }
}