-- RoadRescue MySQL Schema
-- Run this manually if you prefer not to use Hibernate auto-ddl:
--   CREATE DATABASE IF NOT EXISTS roadrescue;
--   USE roadrescue;
--   Then run the statements below.

CREATE DATABASE IF NOT EXISTS roadrescue
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE roadrescue;

CREATE TABLE IF NOT EXISTS users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    contact_number  VARCHAR(20),
    service_area    VARCHAR(300),
    service_categories VARCHAR(300),
    role            VARCHAR(20)  NOT NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS assistance_requests (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id          VARCHAR(30) NOT NULL UNIQUE,
    user_id             BIGINT       NOT NULL,
    customer_name       VARCHAR(100) NOT NULL,
    contact_number      VARCHAR(20)  NOT NULL,
    vehicle_type        VARCHAR(30)  NOT NULL,
    vehicle_model       VARCHAR(100) NOT NULL,
    vehicle_reg_number  VARCHAR(30),
    service_category    VARCHAR(30)  NOT NULL,
    description         TEXT         NOT NULL,
    location            VARCHAR(500) NOT NULL,
    latitude            DECIMAL(10,6),
    longitude           DECIMAL(10,6),
    additional_notes    TEXT,
    status              VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    assigned_provider   VARCHAR(150),
    assigned_mechanic_id BIGINT,
    created_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_request_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_req_request_id (request_id),
    INDEX idx_req_user_id (user_id),
    INDEX idx_req_status (status),
    INDEX idx_req_created_at (created_at),
    INDEX idx_req_service_category (service_category),
    INDEX idx_req_mechanic (assigned_mechanic_id),
    CONSTRAINT fk_request_mechanic FOREIGN KEY (assigned_mechanic_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
