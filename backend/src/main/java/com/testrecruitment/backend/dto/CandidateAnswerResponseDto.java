package com.testrecruitment.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// public class CandidateAnswerResponseDto {
//     private Long id;
//     private Long questionId;
//     private Long selectedOptionId;
//     private String answerText;
//     private Boolean isCorrect;
//     private Double score;
// }

public class CandidateAnswerResponseDto {
    private Long id;
    private Long questionId;
    private Long selectedOptionId;
    private String question;
    private String type;
    private String correctAnswer;
    private String answerText;
    private Boolean isCorrect;
    private Double score;
    private String evaluationNote;
}