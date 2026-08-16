package com.testrecruitment.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.testrecruitment.backend.dto.OptionRequestDto;
import com.testrecruitment.backend.dto.OptionResponseDto;
import com.testrecruitment.backend.mapper.OptionMapper;
import com.testrecruitment.backend.model.Option;
import com.testrecruitment.backend.model.Question;
import com.testrecruitment.backend.repository.OptionRepository;
import com.testrecruitment.backend.repository.QuestionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OptionService {

    private final OptionRepository optionRepository;
    private final QuestionRepository questionRepository;
    private final OptionMapper optionMapper; // pakai bean @Component

    public OptionResponseDto getOptionById(Long id) {
        Option option = optionRepository.findById(id).orElse(null);
        return optionMapper.toResponseDto(option);
    }

    public OptionResponseDto createOption(Long questionId, OptionRequestDto dto) {
        Question question = questionRepository.findById(questionId).orElse(null);
        if (question == null) {
            return null; // atau bisa throw IllegalArgumentException
        }

        Option option = optionMapper.toEntity(dto);
        option.setQuestion(question); // jangan lupa set question
        Option saved = optionRepository.save(option);
        return optionMapper.toResponseDto(saved);
    }

    public List<OptionResponseDto> getOptionsByQuestion(Long questionId) {
        return optionRepository.findByQuestion_Id(questionId).stream()
                .map(optionMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public OptionResponseDto updateOption(Long id, OptionRequestDto dto) {
        Option existing = optionRepository.findById(id).orElse(null);
        if (existing == null) {
            return null;
        }

        existing.setText(dto.getText());
        existing.setCorrect(dto.isCorrect());

        Option updated = optionRepository.save(existing);
        return optionMapper.toResponseDto(updated);
    }

    public boolean deleteOption(Long id) {
        if (!optionRepository.existsById(id)) {
            return false;
        }
        optionRepository.deleteById(id);
        return true;
    }
}