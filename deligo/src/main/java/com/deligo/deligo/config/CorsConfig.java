package com.deligo.deligo.config; // Ajusta el paquete si es necesario

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Permitir todas las rutas de la API
                        .allowedOrigins("http://localhost:3000", "http://localhost:5173") // Puertos comunes de React/Vite
                        .allowedMethods("GET", "POST", "PUT", "DELETE") // Verbos permitidos
                        .allowedHeaders("*");
            }
        };
    }
}