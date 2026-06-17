package com.aiinterview.repository;

import com.aiinterview.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByUserIdOrderByStartedAtDesc(Long userId);
    
    @Query("SELECT i.category as category, COUNT(i) as count FROM Interview i GROUP BY i.category")
    List<Map<String, Object>> countInterviewsByCategory();

    @Query(value = "SELECT DATE_FORMAT(started_at, '%Y-%m') as month, COUNT(*) as count FROM interviews GROUP BY month ORDER BY month ASC", nativeQuery = true)
    List<Map<String, Object>> countInterviewsByMonth();
}
