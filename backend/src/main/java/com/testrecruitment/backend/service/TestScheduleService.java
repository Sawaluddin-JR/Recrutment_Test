package com.testrecruitment.backend.service;

import com.testrecruitment.backend.dto.TestScheduleRequestDto;
import com.testrecruitment.backend.dto.TestScheduleResponseDto;
import com.testrecruitment.backend.mapper.TestScheduleMapper;
import com.testrecruitment.backend.model.Company;
import com.testrecruitment.backend.model.QuestionCode;
// import com.testrecruitment.backend.model.Company;
// import com.testrecruitment.backend.model.QuestionCode;
import com.testrecruitment.backend.model.TestSchedule;
import com.testrecruitment.backend.repository.CompanyRepository;
import com.testrecruitment.backend.repository.QuestionCodeRepository;
// import com.testrecruitment.backend.repository.CompanyRepository;
// import com.testrecruitment.backend.repository.QuestionCodeRepository;
import com.testrecruitment.backend.repository.TestScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestScheduleService {

    private final TestScheduleRepository testScheduleRepository;
    private final CompanyRepository companyRepository;
    private final QuestionCodeRepository questionCodeRepository;

    // CREATE
    public TestScheduleResponseDto createTestSchedule(TestScheduleRequestDto dto) {
        TestSchedule schedule = TestScheduleMapper.toEntity(dto);

        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company tidak ditemukan"));
        schedule.setCompany(company);

        QuestionCode questionCode = questionCodeRepository.findByCode(dto.getQuestionCode())
                .orElseThrow(() -> new RuntimeException("Question code tidak ditemukan"));
        schedule.setQuestionCode(questionCode);

        return TestScheduleMapper.toResponseDto(testScheduleRepository.save(schedule));
    }

    // READ - all
    public List<TestScheduleResponseDto> getAllTestSchedules() {
        return testScheduleRepository.findAll()
                .stream()
                .map(TestScheduleMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    // READ - by id
    public TestScheduleResponseDto getScheduleById(Long id) {
        TestSchedule schedule = testScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jadwal tidak ditemukan"));
        return TestScheduleMapper.toResponseDto(schedule);
    }

    // READ - by codeTest
    public List<TestScheduleResponseDto> getSchedulesByCodeTest(String testCode) {
        return testScheduleRepository.findByCodeTest(testCode)
                .stream()
                .map(TestScheduleMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    // UPDATE
    public TestScheduleResponseDto updateTestSchedule(Long id, TestScheduleRequestDto dto) {
        TestSchedule existing = testScheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Jadwal tidak ditemukan"));

        existing.setCodeTest(dto.getCodeTest());
        existing.setTitle(dto.getTitle());
        existing.setStartTime(dto.getStartTime());
        existing.setEndTime(dto.getEndTime());

        // Update relasi
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company tidak ditemukan"));
        existing.setCompany(company);

        QuestionCode questionCode = questionCodeRepository.findByCode(dto.getQuestionCode())
                .orElseThrow(() -> new RuntimeException("Question code tidak ditemukan"));
        existing.setQuestionCode(questionCode);

        return TestScheduleMapper.toResponseDto(testScheduleRepository.save(existing));
    }

    // DELETE
    public void deleteTestSchedule(Long id) {
        if (!testScheduleRepository.existsById(id)) {
            throw new RuntimeException("Jadwal tidak ditemukan");
        }
        testScheduleRepository.deleteById(id);
    }
}
