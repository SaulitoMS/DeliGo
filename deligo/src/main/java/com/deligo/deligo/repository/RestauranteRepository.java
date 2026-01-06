package com.deligo.deligo.repository;

import com.deligo.deligo.entity.Restaurante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestauranteRepository extends JpaRepository<Restaurante, Long> {
    // ¡Listo! No necesitas escribir nada más.
    // Al extender de JpaRepository, ya tienes automáticamente:
    // .findAll()  -> SELECT * FROM restaurantes
    // .save()     -> INSERT / UPDATE
    // .findById() -> SELECT * FROM ... WHERE id = ?
    // .delete()   -> DELETE
}