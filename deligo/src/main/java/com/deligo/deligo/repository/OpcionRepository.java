package com.deligo.deligo.repository;

import com.deligo.deligo.entity.Opcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OpcionRepository extends JpaRepository<Opcion, Long> {
    // Este método busca todas las opciones vinculadas a un ID de plato específico
    List<Opcion> findByPlatoId(Long platoId);
}