package com.testrecruitment.backend.mapper;

import org.springframework.security.crypto.password.PasswordEncoder;

import com.testrecruitment.backend.dto.LoginResponseDTO;
import com.testrecruitment.backend.dto.RegisterRequestDTO;
import com.testrecruitment.backend.dto.UserRequestDto;
import com.testrecruitment.backend.dto.UserResponseDto;
import com.testrecruitment.backend.model.Users;

public class UserMapper {

    // register
    public static Users fromRegisterDTO(RegisterRequestDTO dto, PasswordEncoder encoder) {
        Users user = new Users();
        user.setEmail(dto.getEmail());
        user.setUsername(dto.getUsername());
        user.setPassword(encoder.encode(dto.getPassword()));
        user.setRole(dto.getRole().toUpperCase());
        return user;
    }

    // login
    public static LoginResponseDTO toDto(String token, Users user) {
        return LoginResponseDTO.builder()
                .token(token)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public static Users toEntity(UserRequestDto dto) {
        Users user = new Users();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());

        return user;
    }

    public static UserResponseDto toResponse(Users user) {
        return new UserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole());
    }
}