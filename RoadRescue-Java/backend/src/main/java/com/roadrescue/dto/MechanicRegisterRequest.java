package com.roadrescue.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class MechanicRegisterRequest {
    @NotBlank(message = "Name is required")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^[0-9+ -]{7,20}$", message = "Invalid contact number")
    private String contactNumber;

    @NotBlank(message = "Service area is required")
    @Size(max = 300)
    private String serviceArea;

    @NotEmpty(message = "Select at least one service")
    private List<String> serviceCategories;

    public MechanicRegisterRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getServiceArea() { return serviceArea; }
    public void setServiceArea(String serviceArea) { this.serviceArea = serviceArea; }

    public List<String> getServiceCategories() { return serviceCategories; }
    public void setServiceCategories(List<String> serviceCategories) { this.serviceCategories = serviceCategories; }
}
