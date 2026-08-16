package com.testrecruitment.backend.dto;

import lombok.Data;

@Data
public class CandidateRequestDto {
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String education;
    private String experience;
    private String position;
    private String status; // aktif / nonaktif
}
