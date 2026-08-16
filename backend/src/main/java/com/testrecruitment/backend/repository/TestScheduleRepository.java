package com.testrecruitment.backend.repository;

import com.testrecruitment.backend.model.TestSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestScheduleRepository extends JpaRepository<TestSchedule, Long> {

    List<TestSchedule> findByCodeTest(String code);

}