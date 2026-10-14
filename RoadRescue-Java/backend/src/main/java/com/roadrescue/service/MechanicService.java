package com.roadrescue.service;

import com.roadrescue.dto.MechanicProfileDTO;
import com.roadrescue.dto.RequestDTO;
import com.roadrescue.dto.UserDTO;
import com.roadrescue.entity.AssistanceRequest;
import com.roadrescue.entity.AssistanceRequest.ServiceCategory;
import com.roadrescue.entity.AssistanceRequest.Status;
import com.roadrescue.entity.User;
import com.roadrescue.exception.BadRequestException;
import com.roadrescue.exception.ResourceNotFoundException;
import com.roadrescue.repository.AssistanceRequestRepository;
import com.roadrescue.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class MechanicService {

    private final AssistanceRequestRepository requestRepository;
    private final UserRepository userRepository;

    public MechanicService(AssistanceRequestRepository requestRepository, UserRepository userRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
    }

    /** Keeps only valid category names and returns them comma-separated. */
    public static String validCategories(List<String> input) {
        String joined = input == null ? "" : input.stream()
                .map(String::trim)
                .filter(c -> Arrays.stream(ServiceCategory.values()).anyMatch(v -> v.name().equals(c)))
                .distinct()
                .collect(Collectors.joining(","));
        if (joined.isEmpty()) throw new BadRequestException("Select at least one valid service");
        return joined;
    }

    private User mechanic(Long id) {
        User u = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (u.getRole() != User.Role.MECHANIC) throw new BadRequestException("Not a mechanic account");
        return u;
    }

    private boolean matches(User m, AssistanceRequest r) {
        List<String> cats = m.getServiceCategories() == null ? List.of()
                : Arrays.stream(m.getServiceCategories().split(",")).map(String::trim).toList();
        if (!cats.isEmpty() && !cats.contains(r.getServiceCategory().name())) return false;
        String loc = r.getLocation() == null ? "" : r.getLocation().toLowerCase(Locale.ROOT);
        return m.getServiceArea() != null && Arrays.stream(m.getServiceArea().split(","))
                .map(a -> a.trim().toLowerCase(Locale.ROOT))
                .anyMatch(a -> a.length() > 1 && loc.contains(a));
    }

    public List<RequestDTO> available(Long mechanicId) {
        User m = mechanic(mechanicId);
        return requestRepository
                .findByAssignedMechanicIdIsNullAndStatusInOrderByCreatedAtDesc(List.of(Status.PENDING, Status.APPROVED))
                .stream().filter(r -> matches(m, r)).map(RequestDTO::new).toList();
    }

    public List<RequestDTO> myJobs(Long mechanicId) {
        return requestRepository.findByAssignedMechanicIdOrderByUpdatedAtDesc(mechanicId)
                .stream().map(RequestDTO::new).toList();
    }

    @Transactional
    public RequestDTO accept(Long mechanicId, Long requestId) {
        User m = mechanic(mechanicId);
        AssistanceRequest r = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        if (r.getAssignedMechanicId() != null
                || !(r.getStatus() == Status.PENDING || r.getStatus() == Status.APPROVED)
                || !matches(m, r)) {
            throw new BadRequestException("This request is no longer available");
        }
        r.setAssignedMechanicId(m.getId());
        r.setAssignedProvider(m.getName() + (m.getContactNumber() != null ? " (" + m.getContactNumber() + ")" : ""));
        r.setStatus(Status.ASSIGNED);
        return new RequestDTO(requestRepository.save(r));
    }

    @Transactional
    public RequestDTO updateStatus(Long mechanicId, Long requestId, String status) {
        Status s;
        try { s = Status.valueOf(status); } catch (Exception e) { throw new BadRequestException("Invalid status"); }
        if (s != Status.IN_PROGRESS && s != Status.COMPLETED) throw new BadRequestException("Invalid status");
        AssistanceRequest r = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        if (!mechanicId.equals(r.getAssignedMechanicId())) throw new ResourceNotFoundException("Job not found");
        if (r.getStatus() != Status.ASSIGNED && r.getStatus() != Status.IN_PROGRESS) {
            throw new BadRequestException("Job already closed");
        }
        r.setStatus(s);
        return new RequestDTO(requestRepository.save(r));
    }

    @Transactional
    public UserDTO updateProfile(Long mechanicId, MechanicProfileDTO dto) {
        User m = mechanic(mechanicId);
        m.setServiceArea(dto.getServiceArea().trim());
        m.setServiceCategories(validCategories(dto.getServiceCategories()));
        return new UserDTO(userRepository.save(m));
    }
}
