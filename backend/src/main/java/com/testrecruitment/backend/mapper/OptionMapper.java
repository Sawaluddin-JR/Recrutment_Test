package com.testrecruitment.backend.mapper;

import org.springframework.stereotype.Component;

import com.testrecruitment.backend.dto.OptionRequestDto;
import com.testrecruitment.backend.dto.OptionResponseDto;
import com.testrecruitment.backend.model.Option;

@Component
public class OptionMapper {

    public OptionResponseDto toResponseDto(Option option) {
        if (option == null)
            return null;

        return OptionResponseDto.builder()
                .id(option.getId())
                .text(option.getText())
                .isCorrect(option.isCorrect())
                .build();
    }

    public Option toEntity(OptionRequestDto dto) {
        if (dto == null)
            return null;

        return Option.builder()
                .text(dto.getText())
                .correct(dto.isCorrect())
                .build();
    }
}