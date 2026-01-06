package com.deligo.deligo.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;

@Entity
@Data
@Table(name = "platos")
public class Plato {
    // ... tus campos id, nombre, precio, etc ...
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String imagenUrl;

    @ManyToOne
    @JoinColumn(name = "restaurante_id")
    private Restaurante restaurante;

    // --- AGREGAR ESTO ---
    @OneToMany(mappedBy = "plato", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Opcion> opciones;
}