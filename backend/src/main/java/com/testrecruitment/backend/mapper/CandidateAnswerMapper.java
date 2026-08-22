package com.testrecruitment.backend.mapper;

import org.springframework.stereotype.Component;

import com.testrecruitment.backend.dto.CandidateAnswerRequestDto;
import com.testrecruitment.backend.dto.CandidateAnswerResponseDto;
import com.testrecruitment.backend.model.CandidateAnswer;
import com.testrecruitment.backend.repository.QuestionRepository;
import com.testrecruitment.backend.model.Question;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor // Update code by sawaluddin
public class CandidateAnswerMapper {

    private final QuestionRepository questionRepository; // Update code by sawaluddin

    public CandidateAnswer toEntity(CandidateAnswerRequestDto dto) {
        if (dto == null)
            return null;
        
        return CandidateAnswer.builder()
                .questionId(dto.getQuestionId())
                .selectedOptionId(dto.getSelectedOptionId())
                .answerText(dto.getAnswerText())
                .build();
    }

    public CandidateAnswerResponseDto toResponse(CandidateAnswer entity) {
        if (entity == null)
            return null;

        // return CandidateAnswerResponseDto.builder()
        //         .id(entity.getId())
        //         .questionId(entity.getQuestionId())
        //         .selectedOptionId(entity.getSelectedOptionId())
        //         .answerText(entity.getAnswerText())
        //         .isCorrect(entity.getIsCorrect())
        //         .score(entity.getScore())
        //         .build();

        // Update code by sawaluddin
        Question question = questionRepository
                .findById(entity.getQuestionId())
                .orElse(null);

        return CandidateAnswerResponseDto.builder()
                .id(entity.getId())
                .questionId(entity.getQuestionId())
                .selectedOptionId(entity.getSelectedOptionId())
                .question(question != null ? question.getContent() : null)
                .correctAnswer(question != null ? question.getCorrectAnswer() : null)
                .answerText(entity.getAnswerText())
                .isCorrect(entity.getIsCorrect())
                .score(entity.getScore())
                .evaluationNote(entity.getEvaluationNote())
                .build();
    }
}