package com.testrecruitment.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.testrecruitment.backend.dto.CandidateAnswerRequestDto;
import com.testrecruitment.backend.dto.CandidateAnswerResponseDto;
import com.testrecruitment.backend.service.CandidateAnswerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/candidateanswer")
@CrossOrigin(origins = "http://localhost:5173")
public class CandidateAnswerController {

    private final CandidateAnswerService candidateAnswerService;

    @PostMapping("/{testResultId}")
    public ResponseEntity<CandidateAnswerResponseDto> submitAnswer(
            @PathVariable Long testResultId,
            @RequestBody CandidateAnswerRequestDto request) {
        CandidateAnswerResponseDto response = candidateAnswerService.saveAnswer(testResultId, request);
        return ResponseEntity.ok(response);
    }

}