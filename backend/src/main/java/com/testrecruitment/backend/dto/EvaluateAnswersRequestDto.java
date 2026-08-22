package com.testrecruitment.backend.dto;

import java.util.List;

import lombok.Data;

@Data
public class EvaluateAnswersRequestDto  {
    private List<EvaluateAnswerItemDto> answers;
}
