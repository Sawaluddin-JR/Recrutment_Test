package com.testrecruitment.backend.repository;

import com.testrecruitment.backend.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCompany_Id(Long companyId);

    List<Question> findByCreatedBy_Id(Long userId);

    List<Question> findByQuestionCode_Id(Long questionCodeId); // 🔹 cari berdasarkan kode soal

}
