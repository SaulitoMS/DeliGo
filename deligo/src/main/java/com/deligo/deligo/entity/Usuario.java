package com.deligo.deligo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "usuarios")
@Data
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    
    @Column(unique = true) // No pueden haber dos correos iguales
    private String email;
    
    private String password; // En el futuro la encriptaremos
    
    private String rol; // Valores posibles: "CLIENTE", "RESTAURANTE", "REPARTIDOR"
    
    // Si es "RESTAURANTE", guardamos a qué restaurante pertenece
    private Long restauranteId; 
}