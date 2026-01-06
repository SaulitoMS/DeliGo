package com.deligo.deligo.controller;

import com.deligo.deligo.entity.Usuario;
import com.deligo.deligo.repository.UsuarioRepository;
import com.deligo.deligo.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil; // CORREGIDO: Faltaba poner el tipo y nombre de variable

    // CORREGIDO: Agregamos JwtUtil al constructor
    public UsuarioController(UsuarioRepository usuarioRepository, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil; // CORREGIDO: Asignamos la variable
    }

    // Endpoint para registrarse
    @PostMapping("/registro")
    public Usuario registrar(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Endpoint para Login
    @PostMapping("/login")
    public String login(@RequestBody Usuario loginData) {
        Usuario usuario = usuarioRepository.findByEmail(loginData.getEmail());
        
        if (usuario != null && usuario.getPassword().equals(loginData.getPassword())) {
            // PASAMOS EL RESTAURANTE ID AL GENERAR EL TOKEN
            return jwtUtil.generateToken(usuario.getEmail(), usuario.getRol(), usuario.getRestauranteId());
        } else {
            throw new RuntimeException("Credenciales incorrectas");
        }
    }
}