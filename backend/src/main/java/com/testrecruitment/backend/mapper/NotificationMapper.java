package com.testrecruitment.backend.mapper;

import com.testrecruitment.backend.dto.NotificationRequestDto;
import com.testrecruitment.backend.dto.NotificationResponseDto;
import com.testrecruitment.backend.model.Notification;

public class NotificationMapper {

    public static Notification toEntity(NotificationRequestDto dto) {
        return Notification.builder()
                .title(dto.getTitle())
                .message(dto.getMessage())
                .type(dto.getType())
                .build();
    }

    public static NotificationResponseDto toResponseDto(Notification entity) {
        return NotificationResponseDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .message(entity.getMessage())
                .type(entity.getType())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}