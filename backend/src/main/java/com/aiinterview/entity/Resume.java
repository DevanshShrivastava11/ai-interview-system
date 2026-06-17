package com.aiinterview.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "file_name", nullable = false, length = 255)
    private String fileName;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "missing_skills", columnDefinition = "TEXT")
    private String missingSkills;

    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }
}
