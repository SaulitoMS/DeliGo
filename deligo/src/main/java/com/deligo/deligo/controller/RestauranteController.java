package com.deligo.deligo.controller;

import com.deligo.deligo.entity.Restaurante;
import com.deligo.deligo.repository.RestauranteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurantes")
public class RestauranteController {

    private final RestauranteRepository restauranteRepository;

    // Inyección de dependencias por constructor (Best Practice)
    public RestauranteController(RestauranteRepository restauranteRepository) {
        this.restauranteRepository = restauranteRepository;
    }

    // GET: Obtener todos los restaurantes
    @GetMapping
    public List<Restaurante> getAllRestaurantes() {
        return restauranteRepository.findAll();
    }

    // POST: Crear un nuevo restaurante
    @PostMapping
    public Restaurante createRestaurante(@RequestBody Restaurante restaurante) {
        return restauranteRepository.save(restaurante);
    }
}