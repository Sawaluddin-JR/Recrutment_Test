// package com.testrecruitment.backend.service;

// import java.util.List;

// import org.springframework.stereotype.Service;

// import com.testrecruitment.backend.dto.CompanyAdminRequestDto;
// import com.testrecruitment.backend.dto.CompanyAdminResponseDto;
// import com.testrecruitment.backend.mapper.CompanyAdminMapper;
// import com.testrecruitment.backend.model.Company;
// import com.testrecruitment.backend.model.CompanyAdmin;
// import com.testrecruitment.backend.model.Users;
// import com.testrecruitment.backend.repository.CompanyAdminRepository;
// import com.testrecruitment.backend.repository.CompanyRepository;
// import com.testrecruitment.backend.repository.UserRepository;

// import jakarta.transaction.Transactional;
// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class CompanyAdminService {

// private final CompanyAdminRepository companyAdminRepository;
// private final CompanyRepository companyRepository;
// private final UserRepository usersRepository;

// public List<CompanyAdminResponseDto> getAllCompanyAdmins() {
// return companyAdminRepository.findAll().stream()
// .map(CompanyAdminMapper::toDto)
// .toList();
// }

// @Transactional
// public CompanyAdminResponseDto createCompanyAdmin(CompanyAdminRequestDto dto)
// {
// Company company = companyRepository.findById(dto.getCompanyId())
// .orElseThrow(() -> new RuntimeException("Company not found with id " +
// dto.getCompanyId()));

// Users adminUser = usersRepository.findById(dto.getAdminUserId())
// .orElseThrow(() -> new RuntimeException("User not found with id " +
// dto.getAdminUserId()));

// CompanyAdmin entity = CompanyAdminMapper.toEntity(dto, company, adminUser);

// CompanyAdmin saved = companyAdminRepository.save(entity);

// return CompanyAdminMapper.toDto(saved);
// }
// }
