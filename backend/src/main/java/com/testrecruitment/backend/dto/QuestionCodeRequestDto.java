package com.testrecruitment.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class QuestionCodeRequestDto {
    @NotBlank(message = "Code tidak boleh kosong.")
    private String code;

    @NotBlank(message = "Title tidak boleh kosong.")
    private String title;

    private String description;

    private Boolean active; // optional

    @NotBlank(message = "Company code tidak boleh kosong.")
    private String companyCode;
}