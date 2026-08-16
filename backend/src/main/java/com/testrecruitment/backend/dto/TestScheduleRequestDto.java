package com.testrecruitment.backend.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TestScheduleRequestDto {

    @NotBlank(message = "Code Test tidak boleh kosong.")
    private String codeTest;

    @NotBlank(message = "Question code tidak boleh kosong.")
    private String questionCode;

    @NotNull(message = "Start time wajib diisi.")
    @Future(message = "Start time harus di masa depan.")
    private LocalDateTime startTime;

    @NotNull(message = "End time wajib diisi.")
    @Future(message = "End time harus di masa depan.")
    private LocalDateTime endTime;

    @NotBlank(message = "Title tidak boleh kosong.")
    private String title;

    @NotNull(message = "Company wajib diisi.")
    private Long companyId;
}