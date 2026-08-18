package com.testrecruitment.backend.mapper;

import com.testrecruitment.backend.dto.TestScheduleRequestDto;
import com.testrecruitment.backend.dto.TestScheduleResponseDto;
import com.testrecruitment.backend.model.TestSchedule;

public class TestScheduleMapper {

    public static TestSchedule toEntity(TestScheduleRequestDto dto) {
        TestSchedule entity = new TestSchedule();

        entity.setTitle(dto.getTitle());
        entity.setCodeTest(dto.getCodeTest());
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setActive(true);

        // entity.setQuestionCode(dto.getQuestionCode());
        // entity.setCompanyId(dto.getCompanyId());

        return entity;
    }

    public static TestScheduleResponseDto toResponseDto(TestSchedule entity) {
        TestScheduleResponseDto dto = new TestScheduleResponseDto();
        dto.setId(entity.getId());
        dto.setCodeTest(entity.getCodeTest());
        dto.setTitle(entity.getTitle());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setActive(entity.isActive());
        dto.setCompany(entity.getCompany() != null ? entity.getCompany().getName() : null);
        dto.setQuestionCode(entity.getQuestionCode() != null ? entity.getQuestionCode().getId() : null);
        return dto;
    }
}
