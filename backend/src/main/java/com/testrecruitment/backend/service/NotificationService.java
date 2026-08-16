package com.testrecruitment.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.testrecruitment.backend.dto.NotificationRequestDto;
import com.testrecruitment.backend.dto.NotificationResponseDto;
import com.testrecruitment.backend.mapper.NotificationMapper;
import com.testrecruitment.backend.model.Notification;
import com.testrecruitment.backend.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    /**
     * Tambah notifikasi baru
     */
    public NotificationResponseDto create(NotificationRequestDto dto) {
        Notification entity = NotificationMapper.toEntity(dto);
        Notification saved = notificationRepository.save(entity);
        return NotificationMapper.toResponseDto(saved);
    }

    /**
     * Ambil semua notifikasi
     */
    public List<NotificationResponseDto> getAll() {
        return notificationRepository.findAll()
                .stream()
                .map(NotificationMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Ambil notifikasi berdasarkan ID
     */
    public NotificationResponseDto getById(Long id) {
        Notification entity = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        return NotificationMapper.toResponseDto(entity);
    }

    /**
     * Hapus notifikasi
     */
    public void delete(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new RuntimeException("Notification not found");
        }
        notificationRepository.deleteById(id);
    }
}