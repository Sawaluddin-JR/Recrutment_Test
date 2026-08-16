// package com.testrecruitment.backend.mapper;

// import com.testrecruitment.backend.dto.UserCompanyRequestDto;
// import com.testrecruitment.backend.dto.UserCompanyResponseDto;
// import com.testrecruitment.backend.model.UserCompany;

// public class UserCompanyMapper {

// public static UserCompany toEntity(UserCompanyRequestDto dto) {
// UserCompany uc = new UserCompany();
// uc.setRole(dto.getRole());
// return uc;
// }

// public static UserCompanyResponseDto toResponse(UserCompany uc) {
// UserCompanyResponseDto dto = new UserCompanyResponseDto();
// dto.setId(uc.getId());
// dto.setUserId(uc.getUsers().getId());
// dto.setUserName(uc.getUsers().getUsername());
// dto.setUserEmail(uc.getUsers().getEmail());
// dto.setCompanyId(uc.getCompany().getId());
// dto.setCompanyCode(uc.getCompany().getCode());
// dto.setCompanyName(uc.getCompany().getName());
// dto.setRole(uc.getRole());
// dto.setJoinedAt(uc.getJoinedAt());
// return dto;
// }
// }
