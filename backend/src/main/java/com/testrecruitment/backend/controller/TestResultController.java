package com.testrecruitment.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.testrecruitment.backend.dto.TestResultRequestDto;
import com.testrecruitment.backend.dto.TestResultResponseDto;
import com.testrecruitment.backend.service.TestResultService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/testresult")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class TestResultController {

    private final TestResultService testResultService;

    @PostMapping
    public ResponseEntity<TestResultResponseDto> create(@RequestBody TestResultRequestDto requestDto) {
        return ResponseEntity.ok(testResultService.create(requestDto));
    }

    @GetMapping
    public ResponseEntity<List<TestResultResponseDto>> getAll() {
        return ResponseEntity.ok(testResultService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestResultResponseDto> getById(@PathVariable Long id) {
        TestResultResponseDto result = testResultService.getById(id);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<TestResultResponseDto> update(@PathVariable Long id,
            @RequestBody TestResultRequestDto requestDto) {
        TestResultResponseDto result = testResultService.update(id, requestDto);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        testResultService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/submit")
    public ResponseEntity<TestResultResponseDto> submit(@PathVariable Long id) {
        return ResponseEntity.ok(testResultService.submitTest(id));
    }

}
