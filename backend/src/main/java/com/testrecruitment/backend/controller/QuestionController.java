package com.testrecruitment.backend.controller;

import com.testrecruitment.backend.dto.QuestionRequestDto;
import com.testrecruitment.backend.dto.QuestionResponseDto;
import com.testrecruitment.backend.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<QuestionResponseDto> create(@RequestBody QuestionRequestDto dto) {
        QuestionResponseDto created = questionService.createQuestion(dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponseDto>> getAll() {
        return ResponseEntity.ok(questionService.getAllQuestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @GetMapping("/code/{codeId}")
    public ResponseEntity<List<QuestionResponseDto>> getByQuestionCode(@PathVariable Long codeId) {
        return ResponseEntity.ok(questionService.getQuestionsByQuestionCode(codeId));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<QuestionResponseDto>> getByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(questionService.getQuestionsByCompany(companyId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<QuestionResponseDto>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(questionService.getQuestionsByUser(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionResponseDto> update(
            @PathVariable Long id,
            @RequestBody QuestionRequestDto dto) {
        return ResponseEntity.ok(questionService.updateQuestion(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
}
