package com.roadrescue.service;

import com.roadrescue.dto.*;
import com.roadrescue.entity.AssistanceRequest;
import com.roadrescue.entity.AssistanceRequest.ServiceCategory;
import com.roadrescue.entity.AssistanceRequest.Status;
import com.roadrescue.exception.BadRequestException;
import com.roadrescue.exception.ResourceNotFoundException;
import com.roadrescue.repository.AssistanceRequestRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class RequestService {

    private final AssistanceRequestRepository requestRepository;
    private final SecureRandom random = new SecureRandom();

    public RequestService(AssistanceRequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    private String generateRequestId() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 4; i++) sb.append(chars.charAt(random.nextInt(chars.length())));
        return "RR-" + date + "-" + sb;
    }

    @Transactional
    public RequestDTO createRequest(Long userId, CreateRequestDTO dto) {
        ServiceCategory category;
        try {
            category = ServiceCategory.valueOf(dto.getServiceCategory());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid service category: " + dto.getServiceCategory());
        }

        AssistanceRequest req = AssistanceRequest.builder()
                .requestId(generateRequestId())
                .userId(userId)
                .customerName(dto.getCustomerName())
                .contactNumber(dto.getContactNumber())
                .vehicleType(dto.getVehicleType())
                .vehicleModel(dto.getVehicleModel())
                .vehicleRegNumber(dto.getVehicleRegNumber())
                .serviceCategory(category)
                .description(dto.getDescription())
                .location(dto.getLocation())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .additionalNotes(dto.getAdditionalNotes())
                .status(Status.PENDING)
                .build();

        requestRepository.save(req);
        return new RequestDTO(req);
    }

    public List<RequestDTO> getMyRequests(Long userId) {
        return requestRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(RequestDTO::new).toList();
    }

    public RequestDTO getRequestById(Long userId, Long requestId) {
        AssistanceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        if (!req.getUserId().equals(userId)) {
            throw new BadRequestException("You do not have access to this request");
        }
        return new RequestDTO(req);
    }

    public TrackDTO trackByRequestId(String requestId) {
        AssistanceRequest req = requestRepository.findByRequestId(requestId.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with ID: " + requestId));
        return new TrackDTO(req);
    }

    @Transactional
    public RequestDTO cancelRequest(Long userId, Long requestId) {
        AssistanceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        if (!req.getUserId().equals(userId)) {
            throw new BadRequestException("You do not have access to this request");
        }
        if (req.getStatus() != Status.PENDING && req.getStatus() != Status.APPROVED) {
            throw new BadRequestException("Only pending or approved requests can be cancelled");
        }
        req.setStatus(Status.CANCELLED);
        requestRepository.save(req);
        return new RequestDTO(req);
    }

    // ---- Admin ----

    public AdminStats getAdminStats() {
        AdminStats stats = new AdminStats();
        stats.setTotal(requestRepository.count());
        stats.setPending(requestRepository.countByStatus(Status.PENDING));
        stats.setApproved(requestRepository.countByStatus(Status.APPROVED));
        stats.setRejected(requestRepository.countByStatus(Status.REJECTED));
        stats.setCompleted(requestRepository.countByStatus(Status.COMPLETED));
        stats.setCancelled(requestRepository.countByStatus(Status.CANCELLED));
        stats.setActive(requestRepository.countByStatus(Status.ASSIGNED)
                + requestRepository.countByStatus(Status.IN_PROGRESS));
        return stats;
    }

    public Page<RequestDTO> adminListRequests(int page, int size, String statusStr,
            String categoryStr, String search, String sortBy, String sortDir) {

        Status status = null;
        if (statusStr != null && !statusStr.isBlank()) {
            try { status = Status.valueOf(statusStr); }
            catch (IllegalArgumentException e) { throw new BadRequestException("Invalid status: " + statusStr); }
        }

        ServiceCategory category = null;
        if (categoryStr != null && !categoryStr.isBlank()) {
            try { category = ServiceCategory.valueOf(categoryStr); }
            catch (IllegalArgumentException e) { throw new BadRequestException("Invalid category: " + categoryStr); }
        }

        String searchPattern = null;
        if (search != null && !search.isBlank()) searchPattern = "%" + search.toLowerCase() + "%";

        Sort sort = Sort.by(sortBy != null ? sortBy : "createdAt");
        sort = "asc".equalsIgnoreCase(sortDir) ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return requestRepository.findFiltered(status, category, searchPattern, pageable)
                .map(RequestDTO::new);
    }

    @Transactional
    public RequestDTO adminUpdateStatus(Long requestId, UpdateStatusDTO dto) {
        AssistanceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        Status newStatus;
        try { newStatus = Status.valueOf(dto.getStatus()); }
        catch (IllegalArgumentException e) { throw new BadRequestException("Invalid status: " + dto.getStatus()); }

        req.setStatus(newStatus);
        if (dto.getAssignedProvider() != null && !dto.getAssignedProvider().isBlank()) {
            req.setAssignedProvider(dto.getAssignedProvider());
        }
        requestRepository.save(req);
        return new RequestDTO(req);
    }
}
