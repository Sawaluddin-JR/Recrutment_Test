package com.testrecruitment.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

import com.testrecruitment.backend.model.QuestionType;

@Data
@Builder
public class QuestionResponseDto {
    private Long id;
    private String content;
    private QuestionType type;
    private String correctAnswer;

    private Long questionCodeId; // 🔹 ID code
    private String questionCodeName; // 🔹 Nama code (misalnya "UMUM")

    private Long companyId;
    private String companyName;

    private Long createdById;
    private String createdByUsername;

    private List<OptionResponseDto> options;
}
