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

    private String cliente; // Por ahora usaremos un nombre simple, luego conectamos usuarios reales
    private LocalDateTime fecha;
    private Double total;
    private String estado; // "PENDIENTE", "ENVIADO", "ENTREGADO"

    // Relación con los detalles
    // CascadeType.ALL significa: "Si guardo el Pedido, guarda también sus detalles automáticamente"
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    @JsonManagedReference // Complemento del BackReference para manejar el JSON correctamente
    private List<DetallePedido> detalles;
}