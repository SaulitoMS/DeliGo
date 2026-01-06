package com.deligo.deligo.controller;

import com.deligo.deligo.entity.Opcion;
import com.deligo.deligo.entity.Plato;
import com.deligo.deligo.repository.OpcionRepository;
import com.deligo.deligo.repository.PlatoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opciones")
@CrossOrigin(origins = "http://localhost:5173") // Permite que React se conecte
public class OpcionController {

    private final OpcionRepository opcionRepository;
    private final PlatoRepository platoRepository;

    // Inyección de dependencias
    public OpcionController(OpcionRepository opcionRepository, PlatoRepository platoRepository) {
        this.opcionRepository = opcionRepository;
        this.platoRepository = platoRepository;
    }

    // 1. OBTENER OPCIONES DE UN PLATO
    @GetMapping("/plato/{platoId}")
    public List<Opcion> getOpcionesByPlato(@PathVariable Long platoId) {
        return opcionRepository.findByPlatoId(platoId);
    }

    // 2. CREAR UNA OPCIÓN NUEVA (Vinculada a un plato)
    @PostMapping("/crear/{platoId}")
    public Opcion crearOpcion(@PathVariable Long platoId, @RequestBody Opcion opcion) {
        // Buscamos el plato primero
        return platoRepository.findById(platoId)
            .map(plato -> {
                // Asignamos el plato a la opción
                opcion.setPlato(plato);
                // Guardamos
                return opcionRepository.save(opcion);
            })
            .orElseThrow(() -> new RuntimeException("Plato no encontrado con ID: " + platoId));
    }

    // 3. ELIMINAR UNA OPCIÓN
    @DeleteMapping("/{id}")
    public void eliminarOpcion(@PathVariable Long id) {
        opcionRepository.deleteById(id);
    }
}