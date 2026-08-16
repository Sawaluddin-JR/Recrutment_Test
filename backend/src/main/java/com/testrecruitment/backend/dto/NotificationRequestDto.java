package com.testrecruitment.backend.dto;

import com.testrecruitment.backend.model.NotificationType;

import lombok.Data;

@Data
public class NotificationRequestDto {
    private String title;
    private String message;
    private NotificationType type;
}