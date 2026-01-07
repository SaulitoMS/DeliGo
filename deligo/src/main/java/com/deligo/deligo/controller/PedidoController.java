package com.deligo.deligo.controller;

import com.deligo.deligo.entity.DetallePedido;
import com.deligo.deligo.entity.Pedido;
import com.deligo.deligo.entity.Plato;
import com.deligo.deligo.repository.PedidoRepository;
import com.deligo.deligo.repository.PlatoRepository; // <--- AGREGAR
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final PlatoRepository platoRepository; // <--- AGREGAR

    public PedidoController(PedidoRepository pedidoRepository, PlatoRepository platoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.platoRepository = platoRepository; // <--- AGREGAR
    }

    // CREAR PEDIDO (Cliente)
    @PostMapping
    public Pedido createPedido(@RequestBody Pedido pedido) {
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado("PENDIENTE");

        double montoTotal = 0;
        
        for (DetallePedido detalle : pedido.getDetalles()) {
            detalle.setPedido(pedido);
            
            // BUSCAR EL PLATO COMPLETO DE LA BD
            Plato platoCompleto = platoRepository.findById(detalle.getPlato().getId())
                .orElseThrow(() -> new RuntimeException("Plato no encontrado"));
            
            detalle.setPlato(platoCompleto);
            detalle.setSubtotal(detalle.getCantidad() * platoCompleto.getPrecio());
            montoTotal += detalle.getSubtotal();
        }
        
        pedido.setTotal(montoTotal);

        return pedidoRepository.save(pedido);
    }

    // OBTENER PEDIDOS PENDIENTES (Para Repartidor)
    @GetMapping("/pendientes")
    public List<Pedido> getPedidosPendientes() {
        return pedidoRepository.findByEstado("PENDIENTE");
    }

    // OBTENER PEDIDOS ASIGNADOS A UN REPARTIDOR
    @GetMapping("/repartidor/{repartidorId}")
    public List<Pedido> getPedidosRepartidor(@PathVariable Long repartidorId) {
        return pedidoRepository.findByRepartidorId(repartidorId);
    }

    // ACEPTAR PEDIDO (Repartidor toma el pedido)
    @PutMapping("/{id}/aceptar")
    public Pedido aceptarPedido(@PathVariable Long id, @RequestBody Long repartidorId) {
        return pedidoRepository.findById(id)
            .map(pedido -> {
                pedido.setEstado("ACEPTADO");
                pedido.setRepartidorId(repartidorId);
                return pedidoRepository.save(pedido);
            })
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }

    // ACTUALIZAR ESTADO DEL PEDIDO
    @PutMapping("/{id}/estado")
    public Pedido actualizarEstado(@PathVariable Long id, @RequestBody String nuevoEstado) {
        return pedidoRepository.findById(id)
            .map(pedido -> {
                pedido.setEstado(nuevoEstado);
                return pedidoRepository.save(pedido);
            })
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
    }

    // OBTENER TODOS LOS PEDIDOS (Para Admin)
    @GetMapping
    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findAll();
    }
}