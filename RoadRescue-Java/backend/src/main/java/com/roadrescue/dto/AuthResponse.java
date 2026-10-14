package com.roadrescue.dto;

import com.roadrescue.entity.User;

public class AuthResponse {
    private String token;
    private UserDTO user;

    public AuthResponse() {}

    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = new UserDTO(user);
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
}
