package com.testrecruitment.backend.dto;

import lombok.Data;

@Data
public class EvaluateAnswerItemDto {
    private Long id;
    private Double score;
    private String evaluationNote;
}
