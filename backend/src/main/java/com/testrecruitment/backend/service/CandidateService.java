package com.testrecruitment.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.testrecruitment.backend.dto.CandidateRequestDto;
import com.testrecruitment.backend.dto.CandidateResponseDto;
import com.testrecruitment.backend.mapper.CandidateMapper;
import com.testrecruitment.backend.model.Candidate;
import com.testrecruitment.backend.model.Users;
import com.testrecruitment.backend.repository.CandidateRepository;
import com.testrecruitment.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final UserRepository usersRepository;

    public List<CandidateResponseDto> getAllCandidates() {
        return candidateRepository.findAll()
                .stream()
                .map(CandidateMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public CandidateResponseDto getCandidateByEmail(String email) {
        Candidate candidate = candidateRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Candidate tidak ditemukan"));
        return CandidateMapper.toResponseDto(candidate);
    }

    public CandidateResponseDto createCandidate(CandidateRequestDto dto) {
        Users user = usersRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User dengan email " + dto.getEmail() + " tidak ditemukan"));

        Candidate candidate = CandidateMapper.toEntity(dto, user);
        Candidate saved = candidateRepository.save(candidate);
        return CandidateMapper.toResponseDto(saved);
    }

    public CandidateResponseDto updateProfileByEmail(String email, CandidateRequestDto dto) {
        Candidate candidate = candidateRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Candidate dengan email " + email + " tidak ditemukan"));

        // Update hanya field yang diizinkan
        candidate.setFullName(dto.getFullName());
        candidate.setPhone(dto.getPhone());
        candidate.setAddress(dto.getAddress());
        candidate.setEducation(dto.getEducation());
        candidate.setExperience(dto.getExperience());
        candidate.setPosition(dto.getPosition());
        candidate.setStatus(dto.getStatus());

        Candidate saved = candidateRepository.save(candidate);

        return CandidateMapper.toResponseDto(saved);
    }

}