package com.testrecruitment.backend.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyResponseDto {
    private Long id;
    private String code;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdByUserId;
    private String createdByUserName; // Misal nama user pembuat
    private String createdByUserEmail; // Misal email user pembuat
}