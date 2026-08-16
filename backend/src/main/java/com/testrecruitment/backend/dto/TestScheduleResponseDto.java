package com.testrecruitment.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TestScheduleResponseDto {

    private Long id;
    private String codeTest;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private boolean active;
    private String company;
    private Long questionCode;
}