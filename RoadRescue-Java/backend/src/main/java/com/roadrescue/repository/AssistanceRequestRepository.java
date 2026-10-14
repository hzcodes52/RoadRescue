package com.roadrescue.repository;

import com.roadrescue.entity.AssistanceRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface AssistanceRequestRepository extends JpaRepository<AssistanceRequest, Long> {

    Optional<AssistanceRequest> findByRequestId(String requestId);

    List<AssistanceRequest> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT r FROM AssistanceRequest r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:category IS NULL OR r.serviceCategory = :category) AND " +
           "(:search IS NULL OR " +
           " LOWER(r.requestId) LIKE LOWER(:search) OR " +
           " LOWER(r.customerName) LIKE LOWER(:search) OR " +
           " LOWER(r.contactNumber) LIKE LOWER(:search))")
    Page<AssistanceRequest> findFiltered(
            @Param("status") AssistanceRequest.Status status,
            @Param("category") AssistanceRequest.ServiceCategory category,
            @Param("search") String search,
            Pageable pageable);

    List<AssistanceRequest> findByAssignedMechanicIdIsNullAndStatusInOrderByCreatedAtDesc(List<AssistanceRequest.Status> statuses);

    List<AssistanceRequest> findByAssignedMechanicIdOrderByUpdatedAtDesc(Long mechanicId);

    long countByStatus(AssistanceRequest.Status status);
}
