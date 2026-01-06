package com.deligo.deligo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "restaurantes")
@Data // ¡Gracias a Lombok, esto crea getters, setters y toString por ti!
public class Restaurante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    
    private String direccion;
    
    private String descripcion;
    
    private String imagenUrl; // Para guardar la URL de la foto del restaurante
}