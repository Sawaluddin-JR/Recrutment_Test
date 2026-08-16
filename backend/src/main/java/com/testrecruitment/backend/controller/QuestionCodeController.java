package com.testrecruitment.backend.controller;

import com.testrecruitment.backend.dto.QuestionCodeRequestDto;
import com.testrecruitment.backend.dto.QuestionCodeResponseDto;
import com.testrecruitment.backend.service.QuestionCodeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questionscode")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class QuestionCodeController {

    private final QuestionCodeService questionCodeService;

    @PostMapping
    public ResponseEntity<QuestionCodeResponseDto> create(@RequestBody @Valid QuestionCodeRequestDto dto) {
        QuestionCodeResponseDto response = questionCodeService.createQuestionCode(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<QuestionCodeResponseDto>> getAll() {
        List<QuestionCodeResponseDto> list = questionCodeService.getAllQuestionCodes();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionCodeResponseDto> getById(@PathVariable Long id) {
        QuestionCodeResponseDto response = questionCodeService.getById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<QuestionCodeResponseDto> getByCode(@PathVariable String code) {
        QuestionCodeResponseDto response = questionCodeService.getByCode(code);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/company/{companyCode}")
    public ResponseEntity<List<QuestionCodeResponseDto>> getByCompany(@PathVariable String companyCode) {
        List<QuestionCodeResponseDto> list = questionCodeService.getByCompany(companyCode);
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionCodeResponseDto> update(
            @PathVariable Long id,
            @RequestBody @Valid QuestionCodeRequestDto dto) {
        QuestionCodeResponseDto updated = questionCodeService.updateQuestionCode(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        questionCodeService.deleteQuestionCode(id);
        return ResponseEntity.noContent().build();
    }
}
