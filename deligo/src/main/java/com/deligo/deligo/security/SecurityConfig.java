package com.deligo.deligo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) 
            .cors(cors -> cors.configure(http))
            .authorizeHttpRequests(auth -> auth
                // Rutas públicas (sin autenticación)
                .requestMatchers("/api/usuarios/login", "/api/usuarios/registro").permitAll()
                
                // Restaurantes - Todos los autenticados
                .requestMatchers("/api/restaurantes/**").authenticated()
                
                // Platos - RESTAURANTE y CLIENTE
                .requestMatchers("/api/platos/**").hasAnyRole("RESTAURANTE", "CLIENTE")
                
                // Opciones (extras) - Solo RESTAURANTE
                .requestMatchers("/api/opciones/**").hasRole("RESTAURANTE")
                
                // PEDIDOS - IMPORTANTE: El orden importa
                .requestMatchers("/api/pedidos/pendientes").hasRole("REPARTIDOR")
                .requestMatchers("/api/pedidos/repartidor/**").hasRole("REPARTIDOR")
                .requestMatchers("/api/pedidos/*/aceptar").hasRole("REPARTIDOR")
                .requestMatchers("/api/pedidos/*/estado").hasRole("REPARTIDOR")
                .requestMatchers("/api/pedidos/**").hasAnyRole("CLIENTE", "RESTAURANTE") // <--- CAMBIADO A /** para incluir POST
                
                // Cualquier otra ruta requiere autenticación
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}