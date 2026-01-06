package com.deligo.deligo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "detalles_pedido")
@Data
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer cantidad;
    private Double subtotal; // cantidad * precio

    // Relación con el Plato (Muchos detalles pueden apuntar al mismo plato)
    @ManyToOne
    @JoinColumn(name = "plato_id")
    private Plato plato;

    // Relación inversa con el Pedido (para que sepa a qué orden pertenece)
    @ManyToOne
    @JoinColumn(name = "pedido_id")
    @JsonBackReference // ESTO ES VITAL: Evita un bucle infinito al convertir a JSON
    private Pedido pedido;
}