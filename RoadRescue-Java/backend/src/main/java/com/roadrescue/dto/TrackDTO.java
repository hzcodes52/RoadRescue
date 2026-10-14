package com.roadrescue.dto;

import com.roadrescue.entity.AssistanceRequest;
import java.time.LocalDateTime;

public class TrackDTO {
    private String requestId;
    private String serviceCategory;
    private String vehicleType;
    private String vehicleModel;
    private String location;
    private String status;
    private String assignedProvider;
    private LocalDateTime createdAt;

    public TrackDTO() {}

    public TrackDTO(AssistanceRequest r) {
        this.requestId = r.getRequestId();
        this.serviceCategory = r.getServiceCategory() != null ? r.getServiceCategory().name() : null;
        this.vehicleType = r.getVehicleType();
        this.vehicleModel = r.getVehicleModel();
        this.location = r.getLocation();
        this.status = r.getStatus() != null ? r.getStatus().name() : null;
        this.assignedProvider = r.getAssignedProvider();
        this.createdAt = r.getCreatedAt();
    }

    public String getRequestId() { return requestId; }
    public void setRequestId(String requestId) { this.requestId = requestId; }

    public String getServiceCategory() { return serviceCategory; }
    public void setServiceCategory(String serviceCategory) { this.serviceCategory = serviceCategory; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedProvider() { return assignedProvider; }
    public void setAssignedProvider(String assignedProvider) { this.assignedProvider = assignedProvider; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
