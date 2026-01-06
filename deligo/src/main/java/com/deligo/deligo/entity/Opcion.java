package com.deligo.deligo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "opciones")
public class Opcion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;        // Ej: Coca Cola
    private Double precioExtra;   // Ej: 30.00
    private String grupo;         // Ej: BEBIDA
    private Boolean esObligatorio;

    @ManyToOne
    @JoinColumn(name = "plato_id")
    @JsonBackReference // <--- IMPORTANTE: Evita que se cicle infinito al cargar platos
    private Plato plato;
}