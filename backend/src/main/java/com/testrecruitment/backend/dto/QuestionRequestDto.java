package com.testrecruitment.backend.dto;

import lombok.Data;

import java.util.List;

import com.testrecruitment.backend.model.QuestionType;

@Data
public class QuestionRequestDto {
    private String content;
    private QuestionType type;
    private String correctAnswer;

    private String questionCode; // 🔹 baru ditambahkan

    private Long companyId;
    private Long createdById;

    private List<OptionRequestDto> options;
}
