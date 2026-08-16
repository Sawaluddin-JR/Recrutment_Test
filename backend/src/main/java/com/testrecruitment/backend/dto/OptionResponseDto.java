package com.testrecruitment.backend.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class OptionResponseDto {
    private Long id;
    private String text;
    private Boolean isCorrect;
}