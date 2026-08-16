package com.testrecruitment.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String codeTest;

    private String title; // Opsional, nama sesi tes

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private boolean active; // status aktif / expired

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne
    @JoinColumn(name = "question_code") // atau questionSetCode jika ada grouping soal
    private QuestionCode questionCode;
}
