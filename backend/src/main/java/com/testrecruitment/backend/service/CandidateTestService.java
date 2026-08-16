// package com.testrecruitment.backend.service;

// import org.springframework.stereotype.Service;

// import com.testrecruitment.backend.dto.CandidateTestRequestDTO;
// import com.testrecruitment.backend.dto.CandidateTestResponseDTO;
// import com.testrecruitment.backend.model.CandidateTest;
// import com.testrecruitment.backend.repository.CandidateTestRepository;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class CandidateTestService {

// private final CandidateTestRepository candidateTestRepository;

// public CandidateTestResponseDTO create(CandidateTestRequestDTO dto) {
// CandidateTest candidateTest = new CandidateTest();
// candidateTest.setUsers(dto.users);
// candidateTest.setTestSchedule(dto.getName());

// Company saved = companyRepository.save(company);
// return toDto(saved);
// }

// public List<CompanyResponseDTO> getAll() {
// return companyRepository.findAll()
// .stream()
// .map(this::toDto)
// .collect(Collectors.toList());
// }

// private CompanyResponseDTO toDto(Company c) {
// CompanyResponseDTO dto = new CompanyResponseDTO();
// dto.setId(c.getId());
// dto.setName(c.getName());
// dto.setCode(c.getCode());
// return dto;
// }
// }
