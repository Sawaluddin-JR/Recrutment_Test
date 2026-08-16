// package com.testrecruitment.backend.service;

// import java.time.LocalDateTime;
// import java.util.Optional;

// import org.springframework.stereotype.Service;

// import com.testrecruitment.backend.dto.UserCompanyRequestDto;
// import com.testrecruitment.backend.dto.UserCompanyResponseDto;
// import com.testrecruitment.backend.mapper.UserCompanyMapper;
// import com.testrecruitment.backend.model.Company;
// import com.testrecruitment.backend.model.UserCompany;
// import com.testrecruitment.backend.model.Users;
// import com.testrecruitment.backend.repository.CompanyRepository;
// import com.testrecruitment.backend.repository.UserCompanyRepository;
// import com.testrecruitment.backend.repository.UserRepository;

// import jakarta.transaction.Transactional;
// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class UserCompanyService {

// private final UserCompanyRepository userCompanyRepository;
// private final UserRepository userRepository;
// private final CompanyRepository companyRepository;

// @Transactional
// public UserCompanyResponseDto createUserCompany(UserCompanyRequestDto
// request) {
// // Cek apakah user sudah join company ini
// if (userCompanyRepository.existsByUsersIdAndCompanyId(request.getUserId(),
// request.getCompanyId())) {
// throw new RuntimeException("User sudah tergabung di company ini");
// }

// Users user = userRepository.findById(request.getUserId())
// .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

// Company company = companyRepository.findById(request.getCompanyId())
// .orElseThrow(() -> new RuntimeException("Company tidak ditemukan"));

// UserCompany uc = UserCompanyMapper.toEntity(request);
// uc.setUsers(user);
// uc.setCompany(company);
// uc.setJoinedAt(LocalDateTime.now());

// UserCompany saved = userCompanyRepository.save(uc);
// return UserCompanyMapper.toResponse(saved);
// }

// public Optional<UserCompanyResponseDto> getUserCompany(Long id) {
// return userCompanyRepository.findById(id)
// .map(UserCompanyMapper::toResponse);
// }
// }