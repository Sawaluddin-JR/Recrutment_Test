package com.testrecruitment.backend.repository;

import com.testrecruitment.backend.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByCode(String code);

    Optional<Company> findByCreatedBy_Id(Long userId);

    boolean existsByCode(String code);
}
