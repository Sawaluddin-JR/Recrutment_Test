package com.testrecruitment.backend.dto;

public class RegisterResponseDTO {
    private String message;
    private String email;
    private String username;
    private String role;

    public RegisterResponseDTO(String message, String email, String username, String role) {
        this.message = message;
        this.email = email;
        this.username = username;
        this.role = role;
    }

    // Getters & Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
