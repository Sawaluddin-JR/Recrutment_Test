package com.testrecruitment.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.testrecruitment.backend.dto.QuestionCodeRequestDto;
import com.testrecruitment.backend.dto.QuestionCodeResponseDto;
import com.testrecruitment.backend.mapper.QuestionCodeMapper;
import com.testrecruitment.backend.model.Company;
import com.testrecruitment.backend.model.QuestionCode;
import com.testrecruitment.backend.repository.CompanyRepository;
import com.testrecruitment.backend.repository.QuestionCodeRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionCodeService {

    private final QuestionCodeRepository questionCodeRepository;
    private final CompanyRepository companyRepository;

    public QuestionCodeResponseDto createQuestionCode(QuestionCodeRequestDto dto) {
        Company company = companyRepository.findByCode(dto.getCompanyCode())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        QuestionCode entity = QuestionCodeMapper.toEntity(dto, company);
        QuestionCode saved = questionCodeRepository.save(entity);
        return QuestionCodeMapper.toResponseDto(saved);
    }

    public List<QuestionCodeResponseDto> getAllQuestionCodes() {
        return questionCodeRepository.findAll()
                .stream()
                .map(QuestionCodeMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public QuestionCodeResponseDto getById(Long id) {
        QuestionCode entity = questionCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question code not found"));
        return QuestionCodeMapper.toResponseDto(entity);
    }

    public QuestionCodeResponseDto getByCode(String code) {
        QuestionCode entity = questionCodeRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Question code not found"));
        return QuestionCodeMapper.toResponseDto(entity);
    }

    public List<QuestionCodeResponseDto> getByCompany(String companyCode) {
        Company company = companyRepository.findByCode(companyCode)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        return questionCodeRepository.findByCompany(company)
                .stream()
                .map(QuestionCodeMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public QuestionCodeResponseDto updateQuestionCode(Long id, QuestionCodeRequestDto dto) {
        QuestionCode existing = questionCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question code not found"));

        // Update fields
        if (dto.getTitle() != null)
            existing.setTitle(dto.getTitle());
        if (dto.getDescription() != null)
            existing.setDescription(dto.getDescription());
        if (dto.getActive() != null)
            existing.setActive(dto.getActive());

        if (dto.getCompanyCode() != null) {
            Company company = companyRepository.findByCode(dto.getCompanyCode())
                    .orElseThrow(() -> new RuntimeException("Company not found"));
            existing.setCompany(company);
        }

        QuestionCode updated = questionCodeRepository.save(existing);
        return QuestionCodeMapper.toResponseDto(updated);
    }

    public void deleteQuestionCode(Long id) {
        QuestionCode entity = questionCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question code not found"));
        questionCodeRepository.delete(entity);
    }
}