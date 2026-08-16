package com.testrecruitment.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.testrecruitment.backend.model.TestResult;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByCandidateId(Long candidateId);
}