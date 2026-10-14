package com.roadrescue.controller;

import com.roadrescue.dto.MechanicProfileDTO;
import com.roadrescue.dto.RequestDTO;
import com.roadrescue.dto.UserDTO;
import com.roadrescue.service.MechanicService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/** Mechanic-only endpoints (secured by hasRole("MECHANIC") in SecurityConfig). */
@RestController
@RequestMapping("/api/mechanic")
public class MechanicController {

    private final MechanicService mechanicService;

    public MechanicController(MechanicService mechanicService) {
        this.mechanicService = mechanicService;
    }

    @GetMapping("/available")
    public ResponseEntity<List<RequestDTO>> available(Authentication auth) {
        return ResponseEntity.ok(mechanicService.available((Long) auth.getPrincipal()));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<RequestDTO>> jobs(Authentication auth) {
        return ResponseEntity.ok(mechanicService.myJobs((Long) auth.getPrincipal()));
    }

    @PatchMapping("/requests/{id}/accept")
    public ResponseEntity<RequestDTO> accept(Authentication auth, @PathVariable Long id) {
        return ResponseEntity.ok(mechanicService.accept((Long) auth.getPrincipal(), id));
    }

    @PatchMapping("/requests/{id}/status")
    public ResponseEntity<RequestDTO> status(Authentication auth, @PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(mechanicService.updateStatus((Long) auth.getPrincipal(), id, body.get("status")));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> profile(Authentication auth, @Valid @RequestBody MechanicProfileDTO dto) {
        return ResponseEntity.ok(mechanicService.updateProfile((Long) auth.getPrincipal(), dto));
    }
}
