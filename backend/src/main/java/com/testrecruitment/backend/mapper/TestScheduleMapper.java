package com.testrecruitment.backend.mapper;

import com.testrecruitment.backend.dto.TestScheduleRequestDto;
import com.testrecruitment.backend.dto.TestScheduleResponseDto;
import com.testrecruitment.backend.model.TestSchedule;

public class TestScheduleMapper {

    // Mapping dari RequestDto ke Entity
    // public static TestSchedule toEntity(TestScheduleRequestDto dto, Company
    // company, QuestionCode questionCode) {
    public static TestSchedule toEntity(TestScheduleRequestDto dto) {
        TestSchedule entity = new TestSchedule();
        entity.setCodeTest(dto.getCodeTest());
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setActive(true); // default aktif saat dibuat, bisa sesuaikan
        // entity.setQuestionCode(dto.getQuestionCode());
        // entity.setCompanyId(dto.getCompanyId());

        // title bisa di-set secara terpisah jika ada logika khusus, misal sama dengan
        // codeTest atau diisi lain
        entity.setTitle(dto.getCodeTest()); // contoh default set title sama codeTest
        return entity;
    }

    // Mapping dari Entity ke ResponseDto
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
