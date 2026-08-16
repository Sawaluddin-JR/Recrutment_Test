package com.testrecruitment.backend.mapper;

import com.testrecruitment.backend.dto.CandidateRequestDto;
import com.testrecruitment.backend.dto.CandidateResponseDto;
import com.testrecruitment.backend.model.Candidate;
import com.testrecruitment.backend.model.Users;

public class CandidateMapper {

    // NOTE: terima Users user sebagai parameter
    public static Candidate toEntity(CandidateRequestDto dto, Users user) {
        if (dto == null)
            return null;

        return Candidate.builder()
                .fullName(dto.getFullName())
                .user(user) // <-- user datang dari service
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .education(dto.getEducation())
                .experience(dto.getExperience())
                .position(dto.getPosition())
                .status(dto.getStatus())
                .build();
    }

    public static CandidateResponseDto toResponseDto(Candidate candidate) {
        if (candidate == null)
            return null;

        CandidateResponseDto dto = new CandidateResponseDto();
        dto.setId(candidate.getId());
        dto.setFullName(candidate.getFullName());
        if (candidate.getUser() != null) {
            dto.setEmail(candidate.getUser().getEmail());
        }
        dto.setPhone(candidate.getPhone());
        dto.setAddress(candidate.getAddress());
        dto.setEducation(candidate.getEducation());
        dto.setExperience(candidate.getExperience());
        dto.setPosition(candidate.getPosition());
        dto.setStatus(candidate.getStatus());
        return dto;
    }
}