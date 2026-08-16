package com.testrecruitment.backend.mapper;

import com.testrecruitment.backend.dto.CompanyRequestDto;
import com.testrecruitment.backend.dto.CompanyResponseDto;
import com.testrecruitment.backend.model.Company;
import com.testrecruitment.backend.model.Users;

public class CompanyMapper {

    // Dari CompanyRequestDto ke entity Company (untuk create/update)
    public static Company fromRequestDto(CompanyRequestDto dto, Users createdByUser) {
        return Company.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .description(dto.getDescription())
                .createdBy(createdByUser)
                // createdAt dan updatedAt biasanya di-handle otomatis di entity / service
                .build();
    }

    // Dari entity Company ke CompanyResponseDto (untuk response)
    public static CompanyResponseDto toResponseDto(Company company) {
        if (company == null)
            return null;

        return CompanyResponseDto.builder()
                .id(company.getId())
                .code(company.getCode())
                .name(company.getName())
                .description(company.getDescription())
                .createdAt(company.getCreatedAt())
                .updatedAt(company.getUpdatedAt())
                .createdByUserId(company.getCreatedBy() != null ? company.getCreatedBy().getId() : null)
                .createdByUserName(company.getCreatedBy() != null ? company.getCreatedBy().getUsername() : null)
                .createdByUserEmail(company.getCreatedBy() != null ? company.getCreatedBy().getEmail() : null)
                .build();
    }
}
