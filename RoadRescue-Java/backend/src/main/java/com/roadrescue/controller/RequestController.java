package com.roadrescue.controller;

import com.roadrescue.dto.*;
import com.roadrescue.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public ResponseEntity<RequestDTO> create(Authentication auth, @Valid @RequestBody CreateRequestDTO dto) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(requestService.createRequest(userId, dto));
    }

    @GetMapping("/my")
    public ResponseEntity<List<RequestDTO>> myRequests(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(requestService.getMyRequests(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequestDTO> getById(Authentication auth, @PathVariable Long id) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(requestService.getRequestById(userId, id));
    }

    @GetMapping("/track/{requestId}")
    public ResponseEntity<TrackDTO> track(@PathVariable String requestId) {
        return ResponseEntity.ok(requestService.trackByRequestId(requestId));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<RequestDTO> cancel(Authentication auth, @PathVariable Long id) {
        Long userId = (Long) auth.getPrincipal();
        return ResponseEntity.ok(requestService.cancelRequest(userId, id));
    }
}
