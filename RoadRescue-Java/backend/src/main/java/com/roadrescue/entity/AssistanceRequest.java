package com.roadrescue.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "assistance_requests", uniqueConstraints = {
    @UniqueConstraint(columnNames = "request_id")
}, indexes = {
    @Index(name = "idx_req_request_id", columnList = "request_id"),
    @Index(name = "idx_req_user_id", columnList = "user_id"),
    @Index(name = "idx_req_status", columnList = "status"),
    @Index(name = "idx_req_created_at", columnList = "created_at"),
    @Index(name = "idx_req_service_category", columnList = "service_category")
})
public class AssistanceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_id", nullable = false, unique = true, length = 30)
    private String requestId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(name = "contact_number", nullable = false, length = 20)
    private String contactNumber;

    @Column(name = "vehicle_type", nullable = false, length = 30)
    private String vehicleType;

    @Column(name = "vehicle_model", nullable = false, length = 100)
    private String vehicleModel;

    @Column(name = "vehicle_reg_number", length = 30)
    private String vehicleRegNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_category", nullable = false, length = 30)
    private ServiceCategory serviceCategory;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 500)
    private String location;

    @Column(columnDefinition = "DECIMAL(10,6)")
    private Double latitude;

    @Column(columnDefinition = "DECIMAL(10,6)")
    private Double longitude;

    @Column(name = "additional_notes", columnDefinition = "TEXT")
    private String additionalNotes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status;

    @Column(name = "assigned_provider", length = 150)
    private String assignedProvider;

    @Column(name = "assigned_mechanic_id")
    private Long assignedMechanicId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ServiceCategory {
        VEHICLE_BREAKDOWN, PUNCTURE_TYRE, BATTERY_JUMPSTART,
        EMERGENCY_TOWING, MECHANICAL_REPAIRS, OTHER
    }

    public enum Status {
        PENDING, APPROVED, REJECTED, ASSIGNED,
        IN_PROGRESS, COMPLETED, CANCELLED
    }

    public AssistanceRequest() {
    }

    public AssistanceRequest(Long id, String requestId, Long userId, String customerName, String contactNumber,
                             String vehicleType, String vehicleModel, String vehicleRegNumber,
                             ServiceCategory serviceCategory, String description, String location,
                             Double latitude, Double longitude, String additionalNotes, Status status,
                             String assignedProvider, Long assignedMechanicId,
                             LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.requestId = requestId;
        this.userId = userId;
        this.customerName = customerName;
        this.contactNumber = contactNumber;
        this.vehicleType = vehicleType;
        this.vehicleModel = vehicleModel;
        this.vehicleRegNumber = vehicleRegNumber;
        this.serviceCategory = serviceCategory;
        this.description = description;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.additionalNotes = additionalNotes;
        this.status = status;
        this.assignedProvider = assignedProvider;
        this.assignedMechanicId = assignedMechanicId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }

    public String getVehicleRegNumber() { return vehicleRegNumber; }
    public void setVehicleRegNumber(String vehicleRegNumber) { this.vehicleRegNumber = vehicleRegNumber; }

    public ServiceCategory getServiceCategory() { return serviceCategory; }
    public void setServiceCategory(ServiceCategory serviceCategory) { this.serviceCategory = serviceCategory; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getAdditionalNotes() { return additionalNotes; }
    public void setAdditionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getAssignedProvider() { return assignedProvider; }
    public void setAssignedProvider(String assignedProvider) { this.assignedProvider = assignedProvider; }

    public Long getAssignedMechanicId() { return assignedMechanicId; }
    public void setAssignedMechanicId(Long assignedMechanicId) { this.assignedMechanicId = assignedMechanicId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) status = Status.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static AssistanceRequestBuilder builder() {
        return new AssistanceRequestBuilder();
    }

    public static class AssistanceRequestBuilder {
        private Long id;
        private String requestId;
        private Long userId;
        private String customerName;
        private String contactNumber;
        private String vehicleType;
        private String vehicleModel;
        private String vehicleRegNumber;
        private ServiceCategory serviceCategory;
        private String description;
        private String location;
        private Double latitude;
        private Double longitude;
        private String additionalNotes;
        private Status status;
        private String assignedProvider;
        private Long assignedMechanicId;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public AssistanceRequestBuilder id(Long id) { this.id = id; return this; }
        public AssistanceRequestBuilder requestId(String requestId) { this.requestId = requestId; return this; }
        public AssistanceRequestBuilder userId(Long userId) { this.userId = userId; return this; }
        public AssistanceRequestBuilder customerName(String customerName) { this.customerName = customerName; return this; }
        public AssistanceRequestBuilder contactNumber(String contactNumber) { this.contactNumber = contactNumber; return this; }
        public AssistanceRequestBuilder vehicleType(String vehicleType) { this.vehicleType = vehicleType; return this; }
        public AssistanceRequestBuilder vehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; return this; }
        public AssistanceRequestBuilder vehicleRegNumber(String vehicleRegNumber) { this.vehicleRegNumber = vehicleRegNumber; return this; }
        public AssistanceRequestBuilder serviceCategory(ServiceCategory serviceCategory) { this.serviceCategory = serviceCategory; return this; }
        public AssistanceRequestBuilder description(String description) { this.description = description; return this; }
        public AssistanceRequestBuilder location(String location) { this.location = location; return this; }
        public AssistanceRequestBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public AssistanceRequestBuilder longitude(Double longitude) { this.longitude = longitude; return this; }
        public AssistanceRequestBuilder additionalNotes(String additionalNotes) { this.additionalNotes = additionalNotes; return this; }
        public AssistanceRequestBuilder status(Status status) { this.status = status; return this; }
        public AssistanceRequestBuilder assignedProvider(String assignedProvider) { this.assignedProvider = assignedProvider; return this; }
        public AssistanceRequestBuilder assignedMechanicId(Long assignedMechanicId) { this.assignedMechanicId = assignedMechanicId; return this; }
        public AssistanceRequestBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public AssistanceRequestBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public AssistanceRequest build() {
            return new AssistanceRequest(id, requestId, userId, customerName, contactNumber,
                    vehicleType, vehicleModel, vehicleRegNumber, serviceCategory, description,
                    location, latitude, longitude, additionalNotes, status,
                    assignedProvider, assignedMechanicId, createdAt, updatedAt);
        }
    }
}
