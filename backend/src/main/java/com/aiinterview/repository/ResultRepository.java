package com.aiinterview.repository;

import com.aiinterview.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    Optional<Result> findByInterviewId(Long interviewId);

    @Query("SELECT AVG(r.overallScore) FROM Result r")
    Double getAverageOverallScore();

    @Query("SELECT r.interview.category as category, AVG(r.overallScore) as avgScore FROM Result r GROUP BY r.interview.category")
    List<Map<String, Object>> getAverageScoreByCategory();

    @Query("SELECT r FROM Result r ORDER BY r.overallScore DESC")
    List<Result> findTopPerformingResults();
}
