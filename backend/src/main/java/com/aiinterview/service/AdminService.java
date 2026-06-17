package com.aiinterview.service;

import com.aiinterview.dto.AdminAnalyticsResponse;
import com.aiinterview.entity.Interview;
import com.aiinterview.entity.Result;
import com.aiinterview.entity.User;
import com.aiinterview.entity.UserRole;
import com.aiinterview.repository.InterviewRepository;
import com.aiinterview.repository.ResultRepository;
import com.aiinterview.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final InterviewRepository interviewRepository;
    private final ResultRepository resultRepository;

    public AdminService(UserRepository userRepository,
                        InterviewRepository interviewRepository,
                        ResultRepository resultRepository) {
        this.userRepository = userRepository;
        this.interviewRepository = interviewRepository;
        this.resultRepository = resultRepository;
    }

    public AdminAnalyticsResponse getAnalytics() {
        long totalUsers = userRepository.countByRole(UserRole.CANDIDATE);
        long totalInterviews = interviewRepository.count();
        
        Double averageScoreVal = resultRepository.getAverageOverallScore();
        double averageScore = (averageScoreVal != null) ? averageScoreVal : 0.0;

        List<Map<String, Object>> categoryCounts = interviewRepository.countInterviewsByCategory();
        List<Map<String, Object>> categoryScores = resultRepository.getAverageScoreByCategory();
        List<Map<String, Object>> monthlyTrends = interviewRepository.countInterviewsByMonth();

        // Fetch top performers (limit to top 10)
        List<Result> topResults = resultRepository.findTopPerformingResults();
        List<AdminAnalyticsResponse.TopPerformerDto> topPerformers = topResults.stream()
                .limit(10)
                .map(r -> AdminAnalyticsResponse.TopPerformerDto.builder()
                        .name(r.getInterview().getUser().getName())
                        .email(r.getInterview().getUser().getEmail())
                        .category(r.getInterview().getCategory())
                        .overallScore(r.getOverallScore())
                        .build())
                .collect(Collectors.toList());

        return AdminAnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalInterviews(totalInterviews)
                .averageScore(averageScore)
                .categoryCounts(categoryCounts)
                .categoryScores(categoryScores)
                .monthlyTrends(monthlyTrends)
                .topPerformers(topPerformers)
                .build();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }
}
