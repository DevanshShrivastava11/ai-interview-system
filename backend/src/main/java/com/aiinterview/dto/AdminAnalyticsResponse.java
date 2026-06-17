package com.aiinterview.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAnalyticsResponse {
    private Long totalUsers;
    private Long totalInterviews;
    private Double averageScore;
    
    private List<Map<String, Object>> categoryCounts;
    private List<Map<String, Object>> categoryScores;
    private List<Map<String, Object>> monthlyTrends;
    private List<TopPerformerDto> topPerformers;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopPerformerDto {
        private String name;
        private String email;
        private String category;
        private Integer overallScore;
    }
}
