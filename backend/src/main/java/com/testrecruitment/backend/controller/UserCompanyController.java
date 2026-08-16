// package com.testrecruitment.backend.controller;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.testrecruitment.backend.dto.UserCompanyRequestDto;
// import com.testrecruitment.backend.dto.UserCompanyResponseDto;
// import com.testrecruitment.backend.service.UserCompanyService;

// import lombok.RequiredArgsConstructor;

// @RestController
// @RequestMapping("/api/user-companies")
// @RequiredArgsConstructor
// public class UserCompanyController {

// private final UserCompanyService userCompanyService;

// @PostMapping
// public ResponseEntity<UserCompanyResponseDto> createUserCompany(@RequestBody
// UserCompanyRequestDto request) {
// UserCompanyResponseDto response =
// userCompanyService.createUserCompany(request);
// return ResponseEntity.ok(response);
// }

// @GetMapping("/{id}")
// public ResponseEntity<UserCompanyResponseDto> getUserCompany(@PathVariable
// Long id) {
// return userCompanyService.getUserCompany(id)
// .map(ResponseEntity::ok)
// .orElse(ResponseEntity.notFound().build());
// }
// }