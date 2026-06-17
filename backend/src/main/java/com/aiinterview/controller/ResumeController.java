package com.aiinterview.controller;

import com.aiinterview.dto.ResumeResponse;
import com.aiinterview.entity.Resume;
import com.aiinterview.security.UserPrincipal;
import com.aiinterview.service.ResumeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        if (file.isEmpty() || !file.getContentType().equalsIgnoreCase("application/pdf")) {
            return ResponseEntity.badRequest().body("Please upload a valid PDF file.");
        }

        try {
            Resume resume = resumeService.uploadAndAnalyzeResume(principal.getUser(), file);
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(resume));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing resume: " + e.getMessage());
        }
    }

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestResume(@AuthenticationPrincipal UserPrincipal principal) {
        Optional<Resume> resumeOpt = resumeService.getLatestResume(principal.getId());
        if (resumeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mapToResponse(resumeOpt.get()));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getResumeHistory(@AuthenticationPrincipal UserPrincipal principal) {
        List<Resume> resumes = resumeService.getAllResumes(principal.getId());
        List<ResumeResponse> response = resumes.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    private ResumeResponse mapToResponse(Resume resume) {
        return ResumeResponse.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .skills(resume.getSkills())
                .missingSkills(resume.getMissingSkills())
                .recommendations(resume.getRecommendations())
                .uploadedAt(resume.getUploadedAt())
                .build();
    }
}
