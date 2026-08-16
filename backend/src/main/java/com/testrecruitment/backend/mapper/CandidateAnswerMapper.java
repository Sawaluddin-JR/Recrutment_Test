package com.testrecruitment.backend.mapper;

import org.springframework.stereotype.Component;

import com.testrecruitment.backend.dto.CandidateAnswerRequestDto;
import com.testrecruitment.backend.dto.CandidateAnswerResponseDto;
import com.testrecruitment.backend.model.CandidateAnswer;

@Component
public class CandidateAnswerMapper {

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
        return CandidateAnswerResponseDto.builder()
                .id(entity.getId())
                .questionId(entity.getQuestionId())
                .selectedOptionId(entity.getSelectedOptionId())
                .answerText(entity.getAnswerText())
                .isCorrect(entity.getIsCorrect())
                .score(entity.getScore())
                .build();
    }
}