package com.deligo.deligo.repository;

import com.deligo.deligo.entity.Plato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlatoRepository extends JpaRepository<Plato, Long> {
    // Spring crea esto automático: Buscar platos POR el ID del restaurante
    List<Plato> findByRestauranteId(Long restauranteId);
}