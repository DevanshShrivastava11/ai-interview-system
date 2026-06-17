package com.aiinterview.service;

import com.aiinterview.entity.*;
import com.aiinterview.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class InterviewService {

    private static final Logger logger = LoggerFactory.getLogger(InterviewService.class);

    private final InterviewRepository interviewRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final ResultRepository resultRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public InterviewService(InterviewRepository interviewRepository,
                            QuestionRepository questionRepository,
                            AnswerRepository answerRepository,
                            ResultRepository resultRepository,
                            GeminiService geminiService) {
        this.interviewRepository = interviewRepository;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.resultRepository = resultRepository;
        this.geminiService = geminiService;
    }

    @Transactional
    public Interview createInterview(User user, String category, String difficulty) {
        // Create base interview entry
        Interview interview = Interview.builder()
                .user(user)
                .category(category)
                .difficulty(difficulty)
                .status("STARTED")
                .startedAt(LocalDateTime.now())
                .build();

        Interview savedInterview = interviewRepository.save(interview);

        // Call Gemini to generate 10 questions
        List<String> questionTexts = geminiService.generateQuestions(category, difficulty);
        for (String qText : questionTexts) {
            Question question = Question.builder()
                    .interview(savedInterview)
                    .questionText(qText)
                    .build();
            questionRepository.save(question);
        }

        logger.info("Created interview {} with {} generated questions.", savedInterview.getId(), questionTexts.size());
        return savedInterview;
    }

    public List<Interview> getPreviousInterviews(Long userId) {
        return interviewRepository.findByUserIdOrderByStartedAtDesc(userId);
    }

    public Interview getInterviewById(Long interviewId) {
        return interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found with id: " + interviewId));
    }

    public List<Question> getInterviewQuestions(Long interviewId) {
        return questionRepository.findByInterviewIdOrderByIdAsc(interviewId);
    }

    @Transactional
    public Answer submitAnswer(Long interviewId, Long questionId, String answerText, User user) {
        Interview interview = getInterviewById(interviewId);
        if (!interview.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Unauthorized to submit answers for this interview.");
        }

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));

        if (!question.getInterview().getId().equals(interviewId)) {
            throw new RuntimeException("Question does not belong to the specified interview.");
        }

        // Save or update existing answer
        Optional<Answer> existingAnswer = answerRepository.findByQuestionId(questionId);
        Answer answer;
        if (existingAnswer.isPresent()) {
            answer = existingAnswer.get();
            answer.setAnswerText(answerText);
        } else {
            answer = Answer.builder()
                    .question(question)
                    .answerText(answerText)
                    .build();
        }

        return answerRepository.save(answer);
    }

    @Transactional
    public Result submitAndEvaluate(Long interviewId, User user) {
        Interview interview = getInterviewById(interviewId);
        if (!interview.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Unauthorized to complete this interview.");
        }

        if ("COMPLETED".equals(interview.getStatus())) {
            throw new RuntimeException("Interview is already completed and evaluated.");
        }

        List<Question> questions = questionRepository.findByInterviewIdOrderByIdAsc(interviewId);
        List<Map<String, String>> questionAnswersList = new ArrayList<>();

        for (Question q : questions) {
            Optional<Answer> ansOpt = answerRepository.findByQuestionId(q.getId());
            String ansText = ansOpt.isPresent() ? ansOpt.get().getAnswerText() : "[No Answer Provided]";
            
            Map<String, String> qaMap = new HashMap<>();
            qaMap.put("question", q.getQuestionText());
            qaMap.put("answer", ansText);
            questionAnswersList.add(qaMap);
        }

        // Call Gemini to score and evaluate the interview transcript
        String evaluationJson = geminiService.evaluateInterview(
                interview.getCategory(),
                interview.getDifficulty(),
                questionAnswersList
        );

        Integer technicalScore = 0;
        Integer communicationScore = 0;
        Integer overallScore = 0;
        String feedback = "";
        String strengths = "[]";
        String weaknesses = "[]";
        String improvementSuggestions = "[]";

        try {
            JsonNode evalNode = objectMapper.readTree(evaluationJson);
            technicalScore = evalNode.path("technicalScore").asInt(0);
            communicationScore = evalNode.path("communicationScore").asInt(0);
            overallScore = evalNode.path("overallScore").asInt(0);
            feedback = evalNode.path("feedback").asText("");
            strengths = evalNode.path("strengths").toString();
            weaknesses = evalNode.path("weaknesses").toString();
            improvementSuggestions = evalNode.path("improvementSuggestions").toString();
        } catch (Exception e) {
            logger.error("Failed to parse Gemini evaluation JSON. Saving raw feedback.", e);
            feedback = evaluationJson;
            // Generate simple fallbacks if parser failed
            technicalScore = 6;
            communicationScore = 6;
            overallScore = 6;
        }

        Result result = Result.builder()
                .interview(interview)
                .technicalScore(technicalScore)
                .communicationScore(communicationScore)
                .overallScore(overallScore)
                .feedback(feedback)
                .strengths(strengths)
                .weaknesses(weaknesses)
                .improvementSuggestions(improvementSuggestions)
                .build();

        Result savedResult = resultRepository.save(result);

        // Update status of interview to COMPLETED
        interview.setStatus("COMPLETED");
        interview.setCompletedAt(LocalDateTime.now());
        interviewRepository.save(interview);

        logger.info("Successfully evaluated interview {} with overall score {}.", interviewId, overallScore);
        return savedResult;
    }

    public Result getResultByInterviewId(Long interviewId, User user) {
        Interview interview = getInterviewById(interviewId);
        if (!interview.getUser().getId().equals(user.getId()) && !user.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Unauthorized to view results for this interview.");
        }

        return resultRepository.findByInterviewId(interviewId)
                .orElseThrow(() -> new RuntimeException("Result not generated yet for interview id: " + interviewId));
    }

    public Answer getAnswerByQuestionId(Long questionId) {
        return answerRepository.findByQuestionId(questionId).orElse(null);
    }
}
