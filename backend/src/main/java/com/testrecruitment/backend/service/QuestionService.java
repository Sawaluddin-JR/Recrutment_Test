package com.testrecruitment.backend.service;

import com.testrecruitment.backend.dto.QuestionRequestDto;
import com.testrecruitment.backend.dto.QuestionResponseDto;
import com.testrecruitment.backend.mapper.OptionMapper;
import com.testrecruitment.backend.mapper.QuestionMapper;
import com.testrecruitment.backend.model.Company;
import com.testrecruitment.backend.model.Question;
import com.testrecruitment.backend.model.QuestionCode;
import com.testrecruitment.backend.model.Users;
import com.testrecruitment.backend.repository.CompanyRepository;
import com.testrecruitment.backend.repository.QuestionCodeRepository;
import com.testrecruitment.backend.repository.QuestionRepository;
import com.testrecruitment.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final QuestionCodeRepository questionCodeRepository; // 🔹 tambahin ini
    private final QuestionMapper questionMapper;
    private final OptionMapper optionMapper;

    public QuestionResponseDto createQuestion(QuestionRequestDto dto) {
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found with id " + dto.getCompanyId()));

        Users createdBy = userRepository.findById(dto.getCreatedById())
                .orElseThrow(() -> new RuntimeException("User not found with id " + dto.getCreatedById()));

        QuestionCode questionCode = null;
        if (dto.getQuestionCode() != null) {
            questionCode = questionCodeRepository.findByCode(dto.getQuestionCode())
                    .orElseThrow(
                            () -> new RuntimeException("QuestionCode not found with id " + dto.getQuestionCode()));
        }

        Question question = questionMapper.toEntity(dto, company, createdBy, questionCode);
        question.setQuestionCode(questionCode);

        Question saved = questionRepository.save(question);
        return questionMapper.toResponseDto(saved);
    }

    public List<QuestionResponseDto> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(questionMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public QuestionResponseDto getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id " + id));
        return questionMapper.toResponseDto(question);
    }

    public List<QuestionResponseDto> getQuestionsByQuestionCode(Long codeId) {
        return questionRepository.findByQuestionCode_Id(codeId).stream()
                .map(questionMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<QuestionResponseDto> getQuestionsByCompany(Long companyId) {
        return questionRepository.findByCompany_Id(companyId).stream()
                .map(questionMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<QuestionResponseDto> getQuestionsByUser(Long userId) {
        return questionRepository.findByCreatedBy_Id(userId).stream()
                .map(questionMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    public QuestionResponseDto updateQuestion(Long id, QuestionRequestDto dto) {
        Question existing = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id " + id));

        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found with id " + dto.getCompanyId()));

        Users createdBy = userRepository.findById(dto.getCreatedById())
                .orElseThrow(() -> new RuntimeException("User not found with id " + dto.getCreatedById()));

        QuestionCode questionCode = null;
        if (dto.getQuestionCode() != null) {
            questionCode = questionCodeRepository.findByCode(dto.getQuestionCode())
                    .orElseThrow(
                            () -> new RuntimeException("QuestionCode not found with id " + dto.getQuestionCode()));
        }

        existing.setContent(dto.getContent());
        existing.setType(dto.getType());
        existing.setCorrectAnswer(dto.getCorrectAnswer());
        existing.setCompany(company);
        existing.setCreatedBy(createdBy);
        existing.setQuestionCode(questionCode);

        // reset options lama
        existing.getOptions().clear();
        if (dto.getOptions() != null) {
            existing.setOptions(
                    dto.getOptions().stream()
                            .map(optDto -> {
                                var option = optionMapper.toEntity(optDto);
                                option.setQuestion(existing);
                                return option;
                            })
                            .collect(Collectors.toList()));
        }

        Question updated = questionRepository.save(existing);
        return questionMapper.toResponseDto(updated);
    }

    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new RuntimeException("Question not found with id " + id);
        }
        questionRepository.deleteById(id);
    }
}
