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

import com.testrecruitment.backend.dto.OptionRequestDto;
import com.testrecruitment.backend.dto.OptionResponseDto;
import com.testrecruitment.backend.service.OptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/options")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class OptionController {

    private final OptionService optionService;

    @PostMapping
    public ResponseEntity<OptionResponseDto> create(
            @PathVariable Long questionId,
            @RequestBody OptionRequestDto dto) {
        OptionResponseDto created = optionService.createOption(questionId, dto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<OptionResponseDto>> getAllByQuestion(@PathVariable Long questionId) {
        return ResponseEntity.ok(optionService.getOptionsByQuestion(questionId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OptionResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(optionService.getOptionById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OptionResponseDto> update(
            @PathVariable Long id,
            @RequestBody OptionRequestDto dto) {
        return ResponseEntity.ok(optionService.updateOption(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        optionService.deleteOption(id);
        return ResponseEntity.noContent().build();
    }
}