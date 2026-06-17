package com.aiinterview.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeResponse {
    private Long id;
    private String fileName;
    private String skills;
    private String missingSkills;
    private String recommendations;
    private LocalDateTime uploadedAt;
}
