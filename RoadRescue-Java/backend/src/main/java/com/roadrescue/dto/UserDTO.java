package com.roadrescue.dto;

import com.roadrescue.entity.User;
import java.util.Arrays;
import java.util.List;

public class UserDTO {
    private Long id;
    private String email;
    private String name;
    private String role;
    private String contactNumber;
    private String serviceArea;
    private List<String> serviceCategories;

    public UserDTO() {}

    public UserDTO(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.role = user.getRole() != null ? user.getRole().name() : null;
        this.contactNumber = user.getContactNumber();
        this.serviceArea = user.getServiceArea();
        this.serviceCategories = user.getServiceCategories() == null || user.getServiceCategories().isBlank()
                ? List.of() : Arrays.stream(user.getServiceCategories().split(",")).map(String::trim).toList();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getServiceArea() { return serviceArea; }
    public void setServiceArea(String serviceArea) { this.serviceArea = serviceArea; }

    public List<String> getServiceCategories() { return serviceCategories; }
    public void setServiceCategories(List<String> serviceCategories) { this.serviceCategories = serviceCategories; }
}
