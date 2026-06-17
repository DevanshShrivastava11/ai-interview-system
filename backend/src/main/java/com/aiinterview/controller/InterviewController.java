package com.aiinterview.controller;

import com.aiinterview.dto.*;
import com.aiinterview.entity.*;
import com.aiinterview.security.UserPrincipal;
import com.aiinterview.service.InterviewService;
import com.aiinterview.service.PdfReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;
    private final PdfReportService pdfReportService;

    public InterviewController(InterviewService interviewService, PdfReportService pdfReportService) {
        this.interviewService = interviewService;
        this.pdfReportService = pdfReportService;
    }

    @PostMapping("/setup")
    public ResponseEntity<?> createInterview(
            @Valid @RequestBody InterviewSetupRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            Interview interview = interviewService.createInterview(
                    principal.getUser(),
                    request.getCategory(),
                    request.getDifficulty()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(interview, principal.getUser()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error setting up interview: " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getInterviewHistory(@AuthenticationPrincipal UserPrincipal principal) {
        List<Interview> interviews = interviewService.getPreviousInterviews(principal.getId());
        List<InterviewResponse> responses = interviews.stream()
                .map(i -> mapToResponse(i, principal.getUser()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{interviewId}")
    public ResponseEntity<?> getInterviewDetails(
            @PathVariable Long interviewId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            Interview interview = interviewService.getInterviewById(interviewId);
            if (!interview.getUser().getId().equals(principal.getId()) && !principal.getUser().getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
            }
            return ResponseEntity.ok(mapToResponse(interview, principal.getUser()));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{interviewId}/answer/{questionId}")
    public ResponseEntity<?> submitAnswer(
            @PathVariable Long interviewId,
            @PathVariable Long questionId,
            @Valid @RequestBody AnswerRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            Answer answer = interviewService.submitAnswer(interviewId, questionId, request.getAnswerText(), principal.getUser());
            return ResponseEntity.ok("Answer recorded successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{interviewId}/submit")
    public ResponseEntity<?> submitInterview(
            @PathVariable Long interviewId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            Result result = interviewService.submitAndEvaluate(interviewId, principal.getUser());
            return ResponseEntity.ok(mapResultToDto(result));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Evaluation failed: " + e.getMessage());
        }
    }

    @GetMapping("/{interviewId}/result")
    public ResponseEntity<?> getInterviewResult(
            @PathVariable Long interviewId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            Result result = interviewService.getResultByInterviewId(interviewId, principal.getUser());
            return ResponseEntity.ok(mapResultToDto(result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{interviewId}/report")
    public ResponseEntity<byte[]> downloadReport(
            @PathVariable Long interviewId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            Interview interview = interviewService.getInterviewById(interviewId);
            if (!interview.getUser().getId().equals(principal.getId()) && !principal.getUser().getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            List<Question> questions = interviewService.getInterviewQuestions(interviewId);
            // Fetch result and answers
            Result result = interviewService.getResultByInterviewId(interviewId, principal.getUser());
            
            // Map answers
            List<Answer> answers = questions.stream()
                    .map(q -> interviewService.getAnswerByQuestionId(q.getId()))
                    .collect(Collectors.toList());

            byte[] pdfBytes = pdfReportService.generateInterviewReport(interview, questions, answers, result);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "interview_report_" + interviewId + ".pdf");
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private InterviewResponse mapToResponse(Interview interview, User user) {
        List<Question> questions = interviewService.getInterviewQuestions(interview.getId());
        List<QuestionDto> questionDtos = questions.stream()
                .map(q -> {
                    // Pre-fill answer text if exists
                    String ansText = null;
                    try {
                        // We will try loading existing answer text safely
                        Answer answer = interviewService.getAnswerByQuestionId(q.getId());
                        if (answer != null) {
                            ansText = answer.getAnswerText();
                        }
                    } catch (Exception e) {
                        // ignore if none exists
                    }
                    return QuestionDto.builder()
                            .id(q.getId())
                            .questionText(q.getQuestionText())
                            .answerText(ansText)
                            .build();
                })
                .collect(Collectors.toList());

        InterviewResponse.ResultDto resultDto = null;
        try {
            Result result = interviewService.getResultByInterviewId(interview.getId(), user);
            resultDto = mapResultToDto(result);
        } catch (Exception e) {
            // result is not yet available
        }

        return InterviewResponse.builder()
                .id(interview.getId())
                .category(interview.getCategory())
                .difficulty(interview.getDifficulty())
                .status(interview.getStatus())
                .startedAt(interview.getStartedAt())
                .completedAt(interview.getCompletedAt())
                .questions(questionDtos)
                .result(resultDto)
                .build();
    }

    private InterviewResponse.ResultDto mapResultToDto(Result result) {
        return InterviewResponse.ResultDto.builder()
                .technicalScore(result.getTechnicalScore())
                .communicationScore(result.getCommunicationScore())
                .overallScore(result.getOverallScore())
                .feedback(result.getFeedback())
                .strengths(result.getStrengths())
                .weaknesses(result.getWeaknesses())
                .improvementSuggestions(result.getImprovementSuggestions())
                .build();
    }
}
