package com.roadrescue.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class MechanicProfileDTO {
    @NotBlank(message = "Service area is required")
    @Size(max = 300)
    private String serviceArea;

    @NotEmpty(message = "Select at least one service")
    private List<String> serviceCategories;

    public MechanicProfileDTO() {}

    public String getServiceArea() { return serviceArea; }
    public void setServiceArea(String serviceArea) { this.serviceArea = serviceArea; }

    public List<String> getServiceCategories() { return serviceCategories; }
    public void setServiceCategories(List<String> serviceCategories) { this.serviceCategories = serviceCategories; }
}
