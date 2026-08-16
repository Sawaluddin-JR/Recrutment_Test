package com.testrecruitment.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDto {
    private Long id;
    private String username;
    private String email;
    private String role;

}