package com.testrecruitment.backend.dto;

import java.time.LocalDateTime;

import com.testrecruitment.backend.model.NotificationType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationResponseDto {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private LocalDateTime createdAt;
}
