package com.deligo.deligo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Data
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cliente;
    private LocalDateTime fecha;
    private Double total;
    private String estado; // "PENDIENTE", "ACEPTADO", "EN_CAMINO", "ENTREGADO"
    
    // NUEVO: ID del repartidor asignado
    private Long repartidorId;
    
    private String direccionEntrega; // NUEVO
    private String metodoPago; // NUEVO

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<DetallePedido> detalles;
}