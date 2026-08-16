// package com.testrecruitment.backend.model;

// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.time.LocalDateTime;

// @Entity
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// @Builder
// public class CandidateTest {
// @Id
// @GeneratedValue(strategy = GenerationType.IDENTITY)
// private Long id;

// // @ManyToOne
// // @JoinColumn(name = "candidate_id")
// // private Candidate candidate;

// @ManyToMany
// @JoinColumn(name = "user_id")
// private Users users;

// @ManyToOne
// @JoinColumn(name = "test_schedule_id")
// private TestSchedule testSchedule;

// private LocalDateTime startTime; // waktu mulai kandidat mengerjakan
// private LocalDateTime submittedAt; // waktu submit
// private Double score; // skor akhir

// @Enumerated(EnumType.STRING)
// private TestStatus status; // NOT_STARTED, IN_PROGRESS, SUBMITTED
// }
