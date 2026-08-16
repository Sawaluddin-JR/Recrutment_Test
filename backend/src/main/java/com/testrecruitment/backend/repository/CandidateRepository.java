package com.testrecruitment.backend.repository;

import com.testrecruitment.backend.model.Candidate;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByUserEmail(String email);

}
