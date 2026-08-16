package com.testrecruitment.backend.mapper;

import com.testrecruitment.backend.dto.QuestionCodeRequestDto;
import com.testrecruitment.backend.dto.QuestionCodeResponseDto;
import com.testrecruitment.backend.model.Company;
import com.testrecruitment.backend.model.QuestionCode;

public class QuestionCodeMapper {

    public static QuestionCode toEntity(QuestionCodeRequestDto dto, Company company) {
        QuestionCode entity = new QuestionCode();
        entity.setCode(dto.getCode());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setActive(dto.getActive() != null ? dto.getActive() : true);
        entity.setCompany(company);
        return entity;
    }

    public static QuestionCodeResponseDto toResponseDto(QuestionCode entity) {
        QuestionCodeResponseDto dto = new QuestionCodeResponseDto();
        dto.setId(entity.getId());
        dto.setCode(entity.getCode());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setActive(entity.isActive());
        dto.setCompanyCode(entity.getCompany() != null ? entity.getCompany().getCode() : null);
        dto.setQuestionCount(entity.getQuestions() != null ? entity.getQuestions().size() : 0);
        return dto;
    }
}