package com.testrecruitment.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.testrecruitment.backend.model.TestStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestResultRequestDto {
    private Long candidateId;
    private String questionCode;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Integer totalQuestions;
    private Integer correctAnswers;
    private Double score;

    private TestStatus status;
}
