package com.testrecruitment.backend.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String identifier; // Bisa email atau username
    private String password;
}
