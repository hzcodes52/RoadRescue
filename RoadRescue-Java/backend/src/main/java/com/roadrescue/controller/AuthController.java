package com.roadrescue.controller;

import com.roadrescue.dto.*;
import com.roadrescue.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "RoadRescue Backend"));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/register-mechanic")
    public ResponseEntity<AuthResponse> registerMechanic(@Valid @RequestBody com.roadrescue.dto.MechanicRegisterRequest req) {
        return ResponseEntity.ok(authService.registerMechanic(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(authService.getUserById(userId));
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            Authentication auth, @Valid @RequestBody ChangePasswordRequest req) {
        Long userId = (Long) auth.getPrincipal();
        authService.changePassword(userId, req);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
