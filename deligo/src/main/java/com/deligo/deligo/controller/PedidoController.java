package com.deligo.deligo.controller;

import com.deligo.deligo.entity.DetallePedido;
import com.deligo.deligo.entity.Pedido;
import com.deligo.deligo.repository.PedidoRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoRepository pedidoRepository;

    public PedidoController(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    @PostMapping
    public Pedido createPedido(@RequestBody Pedido pedido) {
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado("PENDIENTE");

        // Calcular total y vincular relaciones
        double montoTotal = 0;
        
        for (DetallePedido detalle : pedido.getDetalles()) {
            detalle.setPedido(pedido); // Vincular hijo con padre
            detalle.setSubtotal(detalle.getCantidad() * detalle.getPlato().getPrecio());
            montoTotal += detalle.getSubtotal();
        }
        
        pedido.setTotal(montoTotal);

        return pedidoRepository.save(pedido);
    }
}