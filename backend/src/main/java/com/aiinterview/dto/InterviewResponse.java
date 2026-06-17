package com.aiinterview.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewResponse {
    private Long id;
    private String category;
    private String difficulty;
    private String status;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private List<QuestionDto> questions;
    private ResultDto result;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResultDto {
        private Integer technicalScore;
        private Integer communicationScore;
        private Integer overallScore;
        private String feedback;
        private String strengths;
        private String weaknesses;
        private String improvementSuggestions;
    }
}
