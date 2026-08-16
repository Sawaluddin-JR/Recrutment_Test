package com.testrecruitment.backend.service;

import com.testrecruitment.backend.dto.CompanyRequestDto;
import com.testrecruitment.backend.dto.CompanyResponseDto;
import com.testrecruitment.backend.mapper.CompanyMapper;
import com.testrecruitment.backend.model.Company;
import com.testrecruitment.backend.model.Users;
import com.testrecruitment.backend.repository.CompanyRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserService userService;

    public List<CompanyResponseDto> getAll() {
        return companyRepository.findAll()
                .stream()
                .map(CompanyMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public CompanyResponseDto findByUserId(Long userId) {
        return companyRepository.findByCreatedBy_Id(userId)
                .map(CompanyMapper::toResponseDto)
                .orElse(null);
    }

    @Transactional
    public CompanyResponseDto create(CompanyRequestDto dto) {
        if (dto.getCode() == null || dto.getCode().isBlank()) {
            throw new IllegalArgumentException("Company code is required");
        }
        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new IllegalArgumentException("Company name is required");
        }

        if (companyRepository.existsByCode(dto.getCode())) {
            throw new IllegalArgumentException("Company code already exists");
        }

        Users currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            throw new IllegalStateException("User must be logged in");
        }

        Company company = CompanyMapper.fromRequestDto(dto, currentUser);
        LocalDateTime now = LocalDateTime.now();
        company.setCreatedAt(now);
        company.setUpdatedAt(now);

        Company saved = companyRepository.save(company);
        return CompanyMapper.toResponseDto(saved);
    }

    // 🔹 UPDATE
    @Transactional
    public CompanyResponseDto update(Long id, CompanyRequestDto dto) {
        Company existing = companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        if (dto.getName() != null && !dto.getName().isBlank()) {
            existing.setName(dto.getName());
        }
        if (dto.getCode() != null && !dto.getCode().isBlank()) {
            // cek kalo code berubah, jangan bentrok
            if (!dto.getCode().equals(existing.getCode()) && companyRepository.existsByCode(dto.getCode())) {
                throw new IllegalArgumentException("Company code already exists");
            }
            existing.setCode(dto.getCode());
        }

        existing.setUpdatedAt(LocalDateTime.now());

        Company updated = companyRepository.save(existing);
        return CompanyMapper.toResponseDto(updated);
    }

    // 🔹 DELETE
    @Transactional
    public void delete(Long id) {
        Company existing = companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));
        companyRepository.delete(existing);
    }
}
