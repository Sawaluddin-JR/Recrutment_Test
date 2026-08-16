package com.testrecruitment.backend.mapper;

import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.testrecruitment.backend.dto.QuestionRequestDto;
import com.testrecruitment.backend.dto.QuestionResponseDto;
import com.testrecruitment.backend.model.Company;
import com.testrecruitment.backend.model.Question;
import com.testrecruitment.backend.model.QuestionCode;
import com.testrecruitment.backend.model.Users;

@Component
public class QuestionMapper {

    private final OptionMapper optionMapper;

    public QuestionMapper(OptionMapper optionMapper) {
        this.optionMapper = optionMapper;
    }

    public QuestionResponseDto toResponseDto(Question question) {
        if (question == null)
            return null;

        return QuestionResponseDto.builder()
                .id(question.getId())
                .content(question.getContent())
                .type(question.getType())
                .correctAnswer(question.getCorrectAnswer())
                .questionCodeId(
                        question.getQuestionCode() != null ? question.getQuestionCode().getId() : null)
                .questionCodeName(
                        question.getQuestionCode() != null ? question.getQuestionCode().getCode() : "UMUM")
                .companyId(question.getCompany() != null ? question.getCompany().getId() : null)
                .companyName(question.getCompany() != null ? question.getCompany().getName() : "Umum")
                .createdById(question.getCreatedBy() != null ? question.getCreatedBy().getId() : null)
                .createdByUsername(
                        question.getCreatedBy() != null ? question.getCreatedBy().getUsername() : "System")
                .options(Optional.ofNullable(question.getOptions())
                        .orElse(Collections.emptyList())
                        .stream()
                        .map(optionMapper::toResponseDto)
                        .toList())
                .build();
    }

    public Question toEntity(QuestionRequestDto dto, Company company, Users createdBy, QuestionCode questionCode) {
        if (dto == null)
            return null;

        Question question = Question.builder()
                .content(dto.getContent())
                .type(dto.getType())
                .correctAnswer(dto.getCorrectAnswer())
                .company(company)
                .createdBy(createdBy)
                .questionCode(questionCode) // 🔹 pakai relasi
                .build();

        if (dto.getOptions() != null) {
            question.setOptions(
                    dto.getOptions().stream()
                            .map(optDto -> {
                                var option = optionMapper.toEntity(optDto);
                                option.setQuestion(question);
                                return option;
                            })
                            .collect(Collectors.toList()));
        }

        return question;
    }
}
