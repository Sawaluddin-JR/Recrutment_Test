package com.testrecruitment.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDTO {
    private String token;
    private Long id;
    private String username;
    private String email;
    private String role;
}
