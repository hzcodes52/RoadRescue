package com.roadrescue.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
}, indexes = {
    @Index(name = "idx_user_email", columnList = "email")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "contact_number", length = 20)
    private String contactNumber;

    /** Comma-separated areas a mechanic covers, e.g. "Kukas, Amer". */
    @Column(name = "service_area", length = 300)
    private String serviceArea;

    /** Comma-separated ServiceCategory names a mechanic offers. */
    @Column(name = "service_categories", length = 300)
    private String serviceCategories;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum Role {
        CUSTOMER, ADMIN, MECHANIC
    }

    public User() {
    }

    public User(Long id, String email, String password, String name, String contactNumber,
                String serviceArea, String serviceCategories, Role role,
                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.name = name;
        this.contactNumber = contactNumber;
        this.serviceArea = serviceArea;
        this.serviceCategories = serviceCategories;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getServiceArea() { return serviceArea; }
    public void setServiceArea(String serviceArea) { this.serviceArea = serviceArea; }

    public String getServiceCategories() { return serviceCategories; }
    public void setServiceCategories(String serviceCategories) { this.serviceCategories = serviceCategories; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private Long id;
        private String email;
        private String password;
        private String name;
        private String contactNumber;
        private String serviceArea;
        private String serviceCategories;
        private Role role;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder contactNumber(String contactNumber) { this.contactNumber = contactNumber; return this; }
        public UserBuilder serviceArea(String serviceArea) { this.serviceArea = serviceArea; return this; }
        public UserBuilder serviceCategories(String serviceCategories) { this.serviceCategories = serviceCategories; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public UserBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public User build() {
            return new User(id, email, password, name, contactNumber, serviceArea, serviceCategories, role, createdAt, updatedAt);
        }
    }
}
