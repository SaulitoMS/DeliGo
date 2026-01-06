package com.deligo.deligo.repository;

import com.deligo.deligo.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Spring crea la query: SELECT * FROM usuarios WHERE email = ?
    Usuario findByEmail(String email);
}