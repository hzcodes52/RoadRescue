package com.roadrescue.dto;

import com.roadrescue.entity.AssistanceRequest;
import java.time.LocalDateTime;

public class RequestDTO {
    private Long id;
    private String requestId;
    private String customerName;
    private String contactNumber;
    private String vehicleType;
    private String vehicleModel;
    private String vehicleRegNumber;
    private String serviceCategory;
    private String description;
    private String location;
    private Double latitude;
    private Double longitude;
    private String additionalNotes;
    private String status;
    private String assignedProvider;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long userId;

    public RequestDTO() {}

    public RequestDTO(AssistanceRequest r) {
        this.id = r.getId();
        this.requestId = r.getRequestId();
        this.customerName = r.getCustomerName();
        this.contactNumber = r.getContactNumber();
        this.vehicleType = r.getVehicleType();
        this.vehicleModel = r.getVehicleModel();
        this.vehicleRegNumber = r.getVehicleRegNumber();
        this.serviceCategory = r.getServiceCategory() != null ? r.getServiceCategory().name() : null;
        this.description = r.getDescription();
        this.location = r.getLocation();
        this.latitude = r.getLatitude();
        this.longitude = r.getLongitude();
        this.additionalNotes = r.getAdditionalNotes();
        this.status = r.getStatus() != null ? r.getStatus().name() : null;
        this.assignedProvider = r.getAssignedProvider();
        this.createdAt = r.getCreatedAt();
        this.updatedAt = r.getUpdatedAt();
        this.userId = r.getUserId();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

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

    public String getServiceCategory() { return serviceCategory; }
    public void setServiceCategory(String serviceCategory) { this.serviceCategory = serviceCategory; }

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedProvider() { return assignedProvider; }
    public void setAssignedProvider(String assignedProvider) { this.assignedProvider = assignedProvider; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
