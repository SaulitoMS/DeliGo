package com.deligo.deligo.controller;

import com.deligo.deligo.entity.Plato;
import com.deligo.deligo.repository.PlatoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/platos")
@CrossOrigin(origins = "http://localhost:5173") // <--- IMPORTANTE: Permite la conexión con React
public class PlatoController {

    private final PlatoRepository platoRepository;

    // Constructor: Solo inyectamos lo que realmente usamos
    public PlatoController(PlatoRepository platoRepository) {
        this.platoRepository = platoRepository;
    }

    // 1. OBTENER PLATOS POR RESTAURANTE
    // URL: GET /api/platos/restaurante/{id}
    @GetMapping("/restaurante/{id}")
    public List<Plato> getPlatosByRestaurante(@PathVariable Long id) {
        return platoRepository.findByRestauranteId(id);
    }

    // 2. CREAR UN NUEVO PLATO
    // URL: POST /api/platos/crear
    @PostMapping("/crear")
    public Plato crearPlato(@RequestBody Plato plato) {
        // El JSON ya debe incluir {"restaurante": {"id": X}}
        return platoRepository.save(plato);
    }

    // 3. ACTUALIZAR UN PLATO EXISTENTE
    // URL: PUT /api/platos/actualizar/{id}
    @PutMapping("/actualizar/{id}")
    public Plato actualizarPlato(@PathVariable Long id, @RequestBody Plato platoActualizado) {
        return platoRepository.findById(id)
            .map(plato -> {
                // Actualizamos solo los datos editables
                plato.setNombre(platoActualizado.getNombre());
                plato.setDescripcion(platoActualizado.getDescripcion());
                plato.setPrecio(platoActualizado.getPrecio());
                plato.setImagenUrl(platoActualizado.getImagenUrl());
                
                // Guardamos los cambios
                return platoRepository.save(plato);
            })
            .orElseThrow(() -> new RuntimeException("Plato no encontrado con ID: " + id));
    }

    // 4. ELIMINAR UN PLATO
    // URL: DELETE /api/platos/{id}
    @DeleteMapping("/{id}")
    public void eliminarPlato(@PathVariable Long id) {
        platoRepository.deleteById(id);
    }
}