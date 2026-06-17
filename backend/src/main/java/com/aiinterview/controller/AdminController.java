package com.aiinterview.controller;

import com.aiinterview.dto.AdminAnalyticsResponse;
import com.aiinterview.entity.Interview;
import com.aiinterview.entity.User;
import com.aiinterview.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsResponse> getAnalytics() {
        AdminAnalyticsResponse analytics = adminService.getAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        // Remove password hashes from response before sending
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @GetMapping("/interviews")
    public ResponseEntity<List<Interview>> getAllInterviews() {
        List<Interview> interviews = adminService.getAllInterviews();
        return ResponseEntity.ok(interviews);
    }
}
