package com.testrecruitment.backend.dto;

import lombok.Data;

@Data
public class CandidateResponseDto {
    private Long id;
    private String fullName;
    private String email; // diambil dari Users
    private String phone;
    private String address;
    private String education;
    private String experience;
    private String position;
    private String status;
}
