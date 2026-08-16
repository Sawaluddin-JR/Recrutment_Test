package com.testrecruitment.backend.dto;

import lombok.Data;

@Data
public class QuestionCodeResponseDto {
    private Long id;
    private String code;
    private String title;
    private String description;
    private boolean active;
    private String companyCode;
    private Integer questionCount; // optional
}