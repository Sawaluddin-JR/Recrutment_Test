package com.testrecruitment.backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.annotation.Generated;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // misal: "QST-001"
    private String code;

    private String title; // judul set soal

    private String description;

    @Column(nullable = false)
    private boolean active = true; // default aktif

    @ManyToOne
    @JoinColumn(name = "company_code")
    private Company company;

    @OneToMany(mappedBy = "questionCode", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

}
