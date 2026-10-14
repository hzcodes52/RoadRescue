package com.roadrescue.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateStatusDTO {
    @NotBlank
    private String status;
    private String assignedProvider;

    public UpdateStatusDTO() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedProvider() { return assignedProvider; }
    public void setAssignedProvider(String assignedProvider) { this.assignedProvider = assignedProvider; }
}
