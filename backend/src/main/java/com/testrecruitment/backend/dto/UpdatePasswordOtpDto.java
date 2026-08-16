package com.testrecruitment.backend.dto;

import lombok.Data;

@Data
public class UpdatePasswordOtpDto {
    private String email;
    private String otp;
    private String newPassword;
}
