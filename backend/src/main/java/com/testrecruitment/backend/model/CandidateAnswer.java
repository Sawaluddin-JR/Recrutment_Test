package com.testrecruitment.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "test_result_id")
    private TestResult testResult;

    private Long questionId;

    private Long selectedOptionId; // null jika ESSAY

    @Column(columnDefinition = "TEXT")
    private String answerText; // untuk ESSAY

    private Boolean isCorrect; // null untuk ESSAY
    private Double score; // poin dari soal ini
}