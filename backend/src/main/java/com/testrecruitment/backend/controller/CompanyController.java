package com.testrecruitment.backend.controller;

import com.testrecruitment.backend.dto.CompanyRequestDto;
import com.testrecruitment.backend.dto.CompanyResponseDto;
import com.testrecruitment.backend.service.CompanyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/company")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;
    private static final Logger logger = LoggerFactory.getLogger(CompanyController.class);

    @GetMapping
    public ResponseEntity<List<CompanyResponseDto>> getAll() {
        logger.info("Request to get all companies");
        List<CompanyResponseDto> companies = companyService.getAll();
        return ResponseEntity.ok(companies);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<CompanyResponseDto> getCompanyByUser(@PathVariable Long userId) {
        System.out.println("UserId : " + userId);
        CompanyResponseDto company = companyService.findByUserId(userId);
        if (company == null) {
            return ResponseEntity.ok(null); // balikin 200 OK dengan null
        }
        System.out.println("Response Company User : " + company);
        return ResponseEntity.ok(company);
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CompanyRequestDto dto) {
        logger.info("Request to create company: {}", dto);
        try {
            CompanyResponseDto created = companyService.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException ex) {
            logger.warn("Validation error: {}", ex.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            logger.error("Error creating company", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Terjadi kesalahan saat membuat company"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @Valid @RequestBody CompanyRequestDto dto) {
        logger.info("Request to update company id {}: {}", id, dto);
        try {
            CompanyResponseDto updated = companyService.update(id, dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            logger.warn("Validation error: {}", ex.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            logger.error("Error updating company", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Terjadi kesalahan saat update company"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        logger.info("Request to delete company id {}", id);
        try {
            companyService.delete(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (IllegalArgumentException ex) {
            logger.warn("Company not found: {}", ex.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            logger.error("Error deleting company", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Terjadi kesalahan saat delete company"));
        }
    }

}
