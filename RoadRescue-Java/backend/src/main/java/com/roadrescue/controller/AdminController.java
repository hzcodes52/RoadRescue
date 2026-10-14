package com.roadrescue.controller;

import com.roadrescue.dto.*;
import com.roadrescue.entity.User;
import com.roadrescue.repository.UserRepository;
import com.roadrescue.service.AuthService;
import com.roadrescue.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final RequestService requestService;
    private final UserRepository userRepository;
    private final AuthService authService;

    public AdminController(RequestService requestService, UserRepository userRepository, AuthService authService) {
        this.requestService = requestService;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStats> stats() {
        return ResponseEntity.ok(requestService.getAdminStats());
    }

    @GetMapping("/requests")
    public ResponseEntity<Page<RequestDTO>> listRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String serviceCategory,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(requestService.adminListRequests(
                page, size, status, serviceCategory, search, sortBy, sortDir));
    }

    @PatchMapping("/requests/{id}/status")
    public ResponseEntity<RequestDTO> updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateStatusDTO dto) {
        return ResponseEntity.ok(requestService.adminUpdateStatus(id, dto));
    }

    @GetMapping("/customers")
    public ResponseEntity<List<UserDTO>> customers() {
        List<UserDTO> list = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.CUSTOMER)
                .map(UserDTO::new)
                .toList();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/change-password")
    public ResponseEntity<java.util.Map<String, String>> changePassword(
            Authentication auth, @Valid @RequestBody ChangePasswordRequest req) {
        Long userId = (Long) auth.getPrincipal();
        authService.changePassword(userId, req);
        return ResponseEntity.ok(java.util.Map.of("message", "Password changed successfully"));
    }
}
