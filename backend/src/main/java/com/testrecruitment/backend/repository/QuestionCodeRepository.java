package com.testrecruitment.backend.repository;

import com.testrecruitment.backend.model.Company;
import com.testrecruitment.backend.model.QuestionCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionCodeRepository extends JpaRepository<QuestionCode, Long> {
    List<QuestionCode> findByCompany(Company company);

    Optional<QuestionCode> findByCode(String code);
}