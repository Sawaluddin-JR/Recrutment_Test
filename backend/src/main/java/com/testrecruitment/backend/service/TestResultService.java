package com.testrecruitment.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
// import jakarta.transaction.Transactional;

import com.testrecruitment.backend.dto.EvaluateAnswerItemDto;
import com.testrecruitment.backend.dto.EvaluateAnswersRequestDto;
import com.testrecruitment.backend.dto.TestResultRequestDto;
import com.testrecruitment.backend.dto.TestResultResponseDto;
import com.testrecruitment.backend.mapper.TestResultMapper;
import com.testrecruitment.backend.model.CandidateAnswer;
import com.testrecruitment.backend.model.TestResult;
import com.testrecruitment.backend.model.TestStatus;
import com.testrecruitment.backend.repository.CandidateAnswerRepository;
import com.testrecruitment.backend.repository.TestResultRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TestResultService {

    private final TestResultRepository testResultRepository;
    private final CandidateAnswerRepository candidateAnswerRepository;
    private final TestResultMapper testResultMapper;

    public TestResultResponseDto create(TestResultRequestDto requestDto) {
        TestResult entity = testResultMapper.toEntity(requestDto);
        TestResult saved = testResultRepository.save(entity);
        return testResultMapper.toResponse(saved);
    }

    public List<TestResultResponseDto> getAll() {
        return testResultRepository.findAll()
                .stream()
                .map(testResultMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TestResultResponseDto getById(Long id) {
        return testResultRepository.findById(id)
                .map(testResultMapper::toResponse)
                .orElse(null);
    }

    public TestResultResponseDto update(Long id, TestResultRequestDto requestDto) {
        return testResultRepository.findById(id).map(existing -> {
            existing.setCandidateId(requestDto.getCandidateId());
            existing.setQuestionCode(requestDto.getQuestionCode());
            existing.setStartTime(requestDto.getStartTime());
            existing.setEndTime(requestDto.getEndTime());
            existing.setTotalQuestions(requestDto.getTotalQuestions());
            existing.setStatus(requestDto.getStatus());

            // ✅ hitung ulang jawaban yang tersimpan
            List<CandidateAnswer> answers = existing.getAnswers();
            if (answers != null) {
                int correct = (int) answers.stream().filter(a -> Boolean.TRUE.equals(a.getIsCorrect())).count();
                double score = answers.stream().mapToDouble(a -> a.getScore() != null ? a.getScore() : 0).sum();

                existing.setCorrectAnswers(correct);
                existing.setScore(score);
            }

            return testResultMapper.toResponse(testResultRepository.save(existing));
        }).orElse(null);
    }

    public void delete(Long id) {
        testResultRepository.deleteById(id);
    }

    @Transactional
    public TestResultResponseDto submitTest(Long testResultId) {
        TestResult result = testResultRepository.findById(testResultId)
                .orElseThrow(() -> new RuntimeException("TestResult not found"));

        // ambil semua jawaban kandidat
        List<CandidateAnswer> answers = candidateAnswerRepository.findByTestResultId(testResultId);

        int correctCount = 0;
        for (CandidateAnswer ans : answers) {
            if (Boolean.TRUE.equals(ans.getIsCorrect())) {
                correctCount++;
            }
        }

        // set hasil ke TestResult
        result.setCorrectAnswers(correctCount);
        result.setTotalQuestions(answers.size());
        result.setScore((double) correctCount); // bisa disesuaikan
        result.setStatus(TestStatus.SUBMITTED);
        result.setEndTime(LocalDateTime.now());

        TestResult saved = testResultRepository.save(result);
        return testResultMapper.toResponse(saved);
    }

    // Update code by sawaluddin
    @Transactional
    public TestResultResponseDto evaluateAnswers(
            Long testResultId,
            EvaluateAnswersRequestDto requestDto) {

        TestResult testResult = testResultRepository
                .findById(testResultId)
                .orElse(null);

        if (testResult == null) {
            return null;
        }

        for (EvaluateAnswerItemDto item : requestDto.getAnswers()) {

            CandidateAnswer answer = candidateAnswerRepository
                    .findById(item.getId())
                    .orElse(null);

            if (answer == null) {
                continue;
            }

            // Pastikan answer memang milik TestResult ini
            if (answer.getTestResult() == null ||
                    !answer.getTestResult().getId().equals(testResultId)) {
                continue;
            }

            answer.setScore(item.getScore());
            answer.setEvaluationNote(item.getEvaluationNote());

            candidateAnswerRepository.save(answer);
        }

        // Hitung ulang total score
        List<CandidateAnswer> answers =
                candidateAnswerRepository.findByTestResultId(testResultId);

        double totalScore = answers.stream()
                .mapToDouble(a -> a.getScore() != null ? a.getScore() : 0)
                .sum();

        testResult.setScore(totalScore);

        testResultRepository.save(testResult);

        return testResultMapper.toResponse(testResult);
    }
}