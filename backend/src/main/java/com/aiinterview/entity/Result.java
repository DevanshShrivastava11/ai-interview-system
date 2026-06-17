package com.aiinterview.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "interview_id", nullable = false, unique = true)
    private Interview interview;

    @Column(name = "technical_score", nullable = false)
    private Integer technicalScore;

    @Column(name = "communication_score", nullable = false)
    private Integer communicationScore;

    @Column(name = "overall_score", nullable = false)
    private Integer overallScore;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String feedback;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String strengths;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String weaknesses;

    @Column(name = "improvement_suggestions", nullable = false, columnDefinition = "TEXT")
    private String improvementSuggestions;
}
