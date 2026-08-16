// package com.testrecruitment.backend.mapper;

// import java.time.LocalDateTime;

// import com.testrecruitment.backend.dto.CompanyAdminRequestDto;
// import com.testrecruitment.backend.dto.CompanyAdminResponseDto;
// import com.testrecruitment.backend.model.Company;
// import com.testrecruitment.backend.model.CompanyAdmin;
// import com.testrecruitment.backend.model.Users;

// public class CompanyAdminMapper {

// // Convert from CompanyRequestDto to CompanyAdmin entity
// public static CompanyAdmin toEntity(CompanyAdminRequestDto dto, Company
// company, Users adminUser) {
// CompanyAdmin entity = new CompanyAdmin();
// entity.setCompany(company); // perlu di-set dari service/repository
// berdasarkan companyId
// entity.setAdminUser(adminUser); // perlu di-set dari service/repository
// berdasarkan adminUserId
// entity.setAssignedAt(LocalDateTime.now()); // assignedAt di-set saat
// pembuatan
// return entity;
// }

// // Convert from CompanyAdmin entity to CompanyResponseDto
// public static CompanyAdminResponseDto toDto(CompanyAdmin entity) {
// CompanyAdminResponseDto dto = new CompanyAdminResponseDto();
// dto.setId(entity.getId());
// dto.setCompanyId(entity.getCompany().getId());
// dto.setAdminUserId(entity.getAdminUser().getId());
// dto.setAssignedAt(entity.getAssignedAt());
// return dto;
// }
// }
