package com.testrecruitment.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.testrecruitment.backend.dto.CandidateAnswerRequestDto;
import com.testrecruitment.backend.dto.CandidateAnswerResponseDto;
import com.testrecruitment.backend.mapper.CandidateAnswerMapper;
import com.testrecruitment.backend.model.CandidateAnswer;
import com.testrecruitment.backend.model.Option;
import com.testrecruitment.backend.model.TestResult;
import com.testrecruitment.backend.repository.CandidateAnswerRepository;
import com.testrecruitment.backend.repository.OptionRepository;
import com.testrecruitment.backend.repository.TestResultRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CandidateAnswerService {

    private final CandidateAnswerRepository candidateAnswerRepository;
    private final OptionRepository optionRepository;
    private final TestResultRepository testResultRepository;
    private final CandidateAnswerMapper candidateAnswerMapper;

    @Transactional
    public CandidateAnswerResponseDto saveAnswer(Long testResultId, CandidateAnswerRequestDto request) {
        TestResult testResult = testResultRepository.findById(testResultId)
                .orElseThrow(() -> new RuntimeException("TestResult not found"));

        CandidateAnswer answer = candidateAnswerMapper.toEntity(request);
        answer.setTestResult(testResult);

        // logika cek jawaban pilihan ganda
        if (request.getSelectedOptionId() != null) {
            // misal ambil dari DB: QuestionOption option = optionRepo.findById(...);
            boolean isCorrect = request.getSelectedOptionId().equals(getCorrectOptionId(request.getQuestionId()));
            answer.setIsCorrect(isCorrect);
            answer.setScore(isCorrect ? 10.0 : 0.0);
        } else {
            // untuk essay default dulu 0
            answer.setIsCorrect(null);
            answer.setScore(0.0);
        }

        CandidateAnswer saved = candidateAnswerRepository.save(answer);
        return candidateAnswerMapper.toResponse(saved);
    }

    // ✅ gunakan OptionRepository
    private Long getCorrectOptionId(Long questionId) {
        return optionRepository.findByQuestion_Id(questionId).stream()
                .filter(Option::isCorrect) // ambil option yang benar
                .map(Option::getId)
                .findFirst()
                .orElse(null);
    }

}