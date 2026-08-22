package com.testrecruitment.backend.controller;

import com.testrecruitment.backend.dto.CandidateRequestDto;
import com.testrecruitment.backend.dto.CandidateResponseDto;
import com.testrecruitment.backend.service.CandidateService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/candidates")
@CrossOrigin(origins = "http://localhost:5173")
public class CandidateController {

    private final CandidateService candidateService;

    // Get all candidates (Response DTO)
    @GetMapping
    public ResponseEntity<List<CandidateResponseDto>> getAllCandidates() {
        List<CandidateResponseDto> candidates = candidateService.getAllCandidates();
        return ResponseEntity.ok(candidates);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<CandidateResponseDto> getByEmail(@PathVariable String email) {
        CandidateResponseDto candidate = candidateService.getCandidateByEmail(email);
        return ResponseEntity.ok(candidate);
    }

   @PostMapping
    public ResponseEntity<CandidateResponseDto> addCandidate(
            @RequestBody CandidateRequestDto dto) {

        if (dto.getStatus() == null || dto.getStatus().isBlank()) {
            //dto.setStatus("Menunggu");
            dto.setStatus("aktif");
        }

        CandidateResponseDto created = candidateService.createCandidate(dto);

        return ResponseEntity.ok(created);
    }

    @PutMapping("/profile/{email}")
    public ResponseEntity<CandidateResponseDto> updateProfile(
            @PathVariable String email,
            @RequestBody CandidateRequestDto dto) {

        System.out.println("Response Candidate : " + email);
        CandidateResponseDto updated = candidateService.updateProfileByEmail(email, dto);
        System.out.println("Response Candidate : " + updated);
        return ResponseEntity.ok(updated);
    }
}
