package com.testrecruitment.backend.controller;

import com.testrecruitment.backend.dto.TestScheduleRequestDto;
import com.testrecruitment.backend.dto.TestScheduleResponseDto;
import com.testrecruitment.backend.service.TestScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TestScheduleController {

    private final TestScheduleService testScheduleService;

    // ✅ Ambil semua jadwal
    @GetMapping
    public ResponseEntity<List<TestScheduleResponseDto>> getAllSchedules() {
        return ResponseEntity.ok(testScheduleService.getAllTestSchedules());
    }

    // ✅ Ambil 1 jadwal by ID (untuk view/edit modal)
    @GetMapping("/id/{id}")
    public ResponseEntity<TestScheduleResponseDto> getScheduleById(@PathVariable Long id) {
        return ResponseEntity.ok(testScheduleService.getScheduleById(id));
    }

    // ✅ Ambil semua jadwal berdasarkan codeTest
    @GetMapping("/{testCode}")
    public ResponseEntity<List<TestScheduleResponseDto>> getSchedulesByCodeTest(@PathVariable String testCode) {
        return ResponseEntity.ok(testScheduleService.getSchedulesByCodeTest(testCode));
    }

    // ✅ Tambah jadwal
    @PostMapping
    public ResponseEntity<TestScheduleResponseDto> createSchedule(@RequestBody TestScheduleRequestDto dto) {
        return ResponseEntity.ok(testScheduleService.createTestSchedule(dto));
    }

    // ✅ Update jadwal
    @PutMapping("/{id}")
    public ResponseEntity<TestScheduleResponseDto> updateSchedule(
            @PathVariable Long id,
            @RequestBody TestScheduleRequestDto dto) {
        return ResponseEntity.ok(testScheduleService.updateTestSchedule(id, dto));
    }

    // ✅ Hapus jadwal
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        testScheduleService.deleteTestSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
