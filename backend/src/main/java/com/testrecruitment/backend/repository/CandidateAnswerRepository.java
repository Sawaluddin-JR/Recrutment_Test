package com.testrecruitment.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.testrecruitment.backend.model.CandidateAnswer;

public interface CandidateAnswerRepository extends JpaRepository<CandidateAnswer, Long> {
    List<CandidateAnswer> findByTestResultId(Long testResultId);
}