package com.testrecruitment.backend.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.testrecruitment.backend.dto.CandidateAnswerRequestDto;
import com.testrecruitment.backend.dto.CandidateResponseDto;
import com.testrecruitment.backend.dto.TestResultRequestDto;
import com.testrecruitment.backend.dto.TestResultResponseDto;
import com.testrecruitment.backend.model.Candidate;
import com.testrecruitment.backend.model.CandidateAnswer;
import com.testrecruitment.backend.model.TestResult;
import com.testrecruitment.backend.repository.CandidateRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TestResultMapper {

    private final CandidateAnswerMapper candidateAnswerMapper;
    private final CandidateRepository candidateRepository; // Update code by sawaluddin

    public TestResult toEntity(TestResultRequestDto dto) {
        if (dto == null)
            return null;

        return TestResult.builder()
                .candidateId(dto.getCandidateId())
                .questionCode(dto.getQuestionCode())
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .totalQuestions(dto.getTotalQuestions())
                .correctAnswers(dto.getCorrectAnswers())
                .score(dto.getScore())
                .status(dto.getStatus())
                .build();
    }

    public TestResultResponseDto toResponse(TestResult entity) {
        if (entity == null)
            return null;

            // return TestResultResponseDto.builder()
            //         .id(entity.getId())
            //         .candidateId(entity.getCandidateId())
            //         .questionCode(entity.getQuestionCode())
            //         .startTime(entity.getStartTime())
            //         .endTime(entity.getEndTime())
            //         .totalQuestions(entity.getTotalQuestions())
            //         .correctAnswers(entity.getCorrectAnswers())
            //         .score(entity.getScore())
            //         .status(entity.getStatus())
            //         .answers(entity.getAnswers() != null
            //                 ? entity.getAnswers().stream()
            //                         .map(candidateAnswerMapper::toResponse)
            //                         .collect(Collectors.toList())
            //                 : null)
            //         .build();

        // Update code by sawaluddin

        Candidate candidate = candidateRepository
                .findById(entity.getCandidateId())
                .orElse(null);

        CandidateResponseDto candidateDto = null;

        if (candidate != null) {

            candidateDto = new CandidateResponseDto();

            candidateDto.setId(candidate.getId());
            candidateDto.setFullName(candidate.getFullName());
            candidateDto.setPhone(candidate.getPhone());
            candidateDto.setAddress(candidate.getAddress());
            candidateDto.setEducation(candidate.getEducation());
            candidateDto.setExperience(candidate.getExperience());
            candidateDto.setPosition(candidate.getPosition());
            candidateDto.setStatus(candidate.getStatus());

            if (candidate.getUser() != null) {
                candidateDto.setEmail(candidate.getUser().getEmail());
            }
        }

        return TestResultResponseDto.builder()
                .id(entity.getId())
                .candidateId(entity.getCandidateId())
                .candidate(candidateDto)
                .questionCode(entity.getQuestionCode())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .totalQuestions(entity.getTotalQuestions())
                .correctAnswers(entity.getCorrectAnswers())
                .score(entity.getScore())
                .status(entity.getStatus())
                .answers(entity.getAnswers() != null
                        ? entity.getAnswers()
                                .stream()
                                .map(candidateAnswerMapper::toResponse)
                                .collect(Collectors.toList())
                        : null)
                .build();
    }
}