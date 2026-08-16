package com.testrecruitment.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateAnswerRequestDto {
    private Long questionId;
    private Long selectedOptionId; // null kalau essay
    private String answerText; // isi jawaban kalau essay
}