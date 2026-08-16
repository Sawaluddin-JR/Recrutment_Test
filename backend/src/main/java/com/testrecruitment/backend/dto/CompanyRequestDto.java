package com.testrecruitment.backend.dto;

import lombok.Data;

@Data
public class CompanyRequestDto {
    private String code;
    private String name;
    private String description;
    private Long createdByUserId; // ID user pembuat company, untuk diset dibackend
}