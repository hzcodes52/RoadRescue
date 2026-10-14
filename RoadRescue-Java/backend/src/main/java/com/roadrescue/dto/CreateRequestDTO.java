package com.roadrescue.dto;

import jakarta.validation.constraints.*;

public class CreateRequestDTO {

    @NotBlank(message = "Customer name is required")
    @Size(max = 100)
    private String customerName;

    @NotBlank(message = "Contact number is required")
    @Size(max = 20)
    private String contactNumber;

    @NotBlank(message = "Vehicle type is required")
    @Size(max = 30)
    private String vehicleType;

    @NotBlank(message = "Vehicle model is required")
    @Size(max = 100)
    private String vehicleModel;

    @Size(max = 30)
    private String vehicleRegNumber;

    @NotBlank(message = "Service category is required")
    private String serviceCategory;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Location is required")
    @Size(max = 500)
    private String location;

    private Double latitude;
    private Double longitude;

    private String additionalNotes;

    public CreateRequestDTO() {}

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
}
