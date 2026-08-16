// package com.testrecruitment.backend.controller;

// import java.util.List;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.CrossOrigin;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.testrecruitment.backend.dto.CompanyAdminRequestDto;
// import com.testrecruitment.backend.dto.CompanyAdminResponseDto;
// import com.testrecruitment.backend.dto.CompanyResponseDto;
// import com.testrecruitment.backend.service.CompanyAdminService;

// import lombok.RequiredArgsConstructor;

// @RestController
// @RequiredArgsConstructor
// @RequestMapping("/api/companyadmin")
// @CrossOrigin(origins = "http://localhost:5173")
// public class CompanyAdminController {

// private final CompanyAdminService companyAdminService;

// @GetMapping
// public ResponseEntity<List<CompanyAdminResponseDto>> getAllCompanyAdmins() {
// List<CompanyAdminResponseDto> list =
// companyAdminService.getAllCompanyAdmins();
// return ResponseEntity.ok(list);
// }

// @PostMapping
// public ResponseEntity<CompanyAdminResponseDto> addCompanyAdmin(@RequestBody
// CompanyAdminRequestDto dto) {
// CompanyAdminResponseDto saved = companyAdminService.createCompanyAdmin(dto);
// return ResponseEntity.ok(saved);
// }
// }
