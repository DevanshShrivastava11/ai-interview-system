package com.aiinterview.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Extracts skills, missing skills, recommended technologies, and interview questions from resume text.
     */
    public String analyzeResume(String resumeText) {
        if (!StringUtils.hasText(apiKey)) {
            logger.warn("Gemini API key is not configured. Returning mock resume analysis.");
            return getMockResumeAnalysis();
        }

        String prompt = "Analyze the following resume text. " +
                "Extract: " +
                "1. Skills present in the resume. " +
                "2. Missing skills typically expected for a developer in their domain. " +
                "3. Recommended technologies to study. " +
                "4. 5 recommended interview questions based on their profile. " +
                "Respond strictly in JSON format matching this structure: " +
                "{\"skills\": [\"skill1\", \"skill2\"], \"missingSkills\": [\"skill1\"], \"recommendations\": [\"rec1\"], \"suggestedQuestions\": [\"q1\"]}. " +
                "Resume content:\n" + resumeText;

        return callGemini(prompt);
    }

    /**
     * Generates 10 interview questions based on category and difficulty.
     */
    public List<String> generateQuestions(String category, String difficulty) {
        List<String> questions = new ArrayList<>();
        if (!StringUtils.hasText(apiKey)) {
            logger.warn("Gemini API key is not configured. Returning mock interview questions.");
            return getMockQuestions(category, difficulty);
        }

        String prompt = String.format(
                "Generate 10 technical interview questions for a %s difficulty %s position. " +
                "Mix theoretical knowledge and coding/practical scenarios. " +
                "Return the response strictly as a JSON array of strings, for example: [\"Question 1\", \"Question 2\", ...]. " +
                "Do not include any extra text, markdown wrappers, or explanation outside the JSON array.",
                difficulty, category
        );

        try {
            String jsonResponse = callGemini(prompt);
            JsonNode root = objectMapper.readTree(jsonResponse);
            if (root.isArray()) {
                for (JsonNode node : root) {
                    questions.add(node.asText());
                }
            } else if (root.has("questions") && root.get("questions").isArray()) {
                for (JsonNode node : root.get("questions")) {
                    questions.add(node.asText());
                }
            }
        } catch (Exception e) {
            logger.error("Failed to parse generated questions from Gemini, using fallback mock questions.", e);
            return getMockQuestions(category, difficulty);
        }

        if (questions.isEmpty()) {
            return getMockQuestions(category, difficulty);
        }
        return questions;
    }

    /**
     * Evaluates candidate's performance across the entire interview.
     */
    public String evaluateInterview(String category, String difficulty, List<Map<String, String>> questionAnswers) {
        if (!StringUtils.hasText(apiKey)) {
            logger.warn("Gemini API key is not configured. Returning mock interview evaluation.");
            return getMockEvaluation();
        }

        StringBuilder qaContent = new StringBuilder();
        for (int i = 0; i < questionAnswers.size(); i++) {
            Map<String, String> qa = questionAnswers.get(i);
            qaContent.append(String.format("Q%d: %s\nA%d: %s\n\n", i + 1, qa.get("question"), i + 1, qa.get("answer")));
        }

        String prompt = String.format(
                "Act as a senior technical interviewer. Evaluate this completed interview for a %s role at %s difficulty level. " +
                "Analyze each answer for correctness, clarity, technical depth, and communication skills. " +
                "Provide ratings out of 10. " +
                "Return your evaluation strictly in the following JSON format: " +
                "{\n" +
                "  \"technicalScore\": 8,\n" +
                "  \"communicationScore\": 7,\n" +
                "  \"overallScore\": 8,\n" +
                "  \"feedback\": \"detailed overall feedback summary\",\n" +
                "  \"strengths\": [\"strength 1\", \"strength 2\"],\n" +
                "  \"weaknesses\": [\"weakness 1\", \"weakness 2\"],\n" +
                "  \"improvementSuggestions\": [\"suggestion 1\", \"suggestion 2\"]\n" +
                "}\n" +
                "Interview transcript:\n%s",
                category, difficulty, qaContent.toString()
        );

        return callGemini(prompt);
    }

    private String callGemini(String prompt) {
        try {
            String url = apiUrl + "?key=" + apiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construct payload manually to avoid heavy DTO class mappings
            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);

            Map<String, Object> partsContainer = new HashMap<>();
            partsContainer.put("parts", Collections.singletonList(textPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(partsContainer));

            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("responseMimeType", "application/json");
            requestBody.put("generationConfig", generationConfig);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode responseJson = objectMapper.readTree(response.getBody());
                JsonNode partNode = responseJson.path("candidates").path(0).path("content").path("parts").path(0);
                if (partNode.has("text")) {
                    return partNode.get("text").asText();
                }
            }
            throw new RuntimeException("Empty response or bad format from Gemini");
        } catch (Exception e) {
            logger.error("Gemini API call failed: " + e.getMessage(), e);
            throw new RuntimeException("Failed to communicate with AI model", e);
        }
    }

    // --- FALLBACK MOCK DATA GENERATORS (For API offline/disconnected state) ---

    private String getMockResumeAnalysis() {
        return "{\n" +
                "  \"skills\": [\"Java\", \"Spring Boot\", \"REST APIs\", \"Hibernate\", \"SQL\", \"Git\"],\n" +
                "  \"missingSkills\": [\"Docker\", \"Kubernetes\", \"Redis\", \"Microservices\", \"Spring Security\"],\n" +
                "  \"recommendations\": [\n" +
                "    \"Gain practical exposure to Docker containerization.\",\n" +
                "    \"Study authentication protocols like JWT and OAuth2 in Spring Boot Security.\",\n" +
                "    \"Build a small project implementing caching using Redis.\"\n" +
                "  ],\n" +
                "  \"suggestedQuestions\": [\n" +
                "    \"How does Spring Security filter chain handle authentication and JWT verification?\",\n" +
                "    \"Explain the difference between JPA and Hibernate.\",\n" +
                "    \"What is the purpose of Spring Boot's @RestController annotation?\",\n" +
                "    \"How would you configure a database connection pool in a Spring Boot application?\",\n" +
                "    \"What are the bean scopes available in Spring and how is Singleton scope handled?\"\n" +
                "  ]\n" +
                "}";
    }

    private List<String> getMockQuestions(String category, String difficulty) {
        return Arrays.asList(
                String.format("What is the primary role of a %s developer, and what are the key lifecycle phases of a project in this domain?", category),
                String.format("Explain the concept of dependency injection or layout design principles appropriate to a %s application.", category),
                "Describe how you handle state management, connection pooling, or session scope configurations.",
                String.format("How do you ensure data integrity or validation on inputs inside a %s application?", category),
                "What are the main differences between relational databases and NoSQL solutions in reference to your projects?",
                "How do you implement error handling or exception hierarchies in your code?",
                "Explain the difference between synchronous and asynchronous operations, and when you would use each.",
                String.format("Explain how security controls (like authentication/cors) are set up in %s.", category),
                "How do you approach debugging a memory leak or performance bottleneck in production?",
                "Discuss how you would write unit tests for a critical service class or helper module."
        );
    }

    private String getMockEvaluation() {
        return "{\n" +
                "  \"technicalScore\": 8,\n" +
                "  \"communicationScore\": 7,\n" +
                "  \"overallScore\": 8,\n" +
                "  \"feedback\": \"The candidate demonstrated solid theoretical knowledge of the key concepts of the framework. They correctly answered questions related to dependency lifecycle, database integration, and configuration. Communication was clear, though some practical design explanations could benefit from more structured problem-solving descriptions.\",\n" +
                "  \"strengths\": [\n" +
                "    \"Good grasp of core backend dependencies and security architectures.\",\n" +
                "    \"Accurate explanations of JPA/Hibernate database session bindings.\",\n" +
                "    \"Clear articulation of REST API design and DTO mapping patterns.\"\n" +
                "  ],\n" +
                "  \"weaknesses\": [\n" +
                "    \"Explanations of concurrency controls and thread-safety were a bit abstract.\",\n" +
                "    \"Familiarity with containerized deployments (Docker) could be stronger.\"\n" +
                "  ],\n" +
                "  \"improvementSuggestions\": [\n" +
                "    \"Review core multi-threading models and JPA entity locking behaviors.\",\n" +
                "    \"Practice implementing containerized configurations to explain operational structures in interviews.\",\n" +
                "    \"Enhance structured answering style (e.g., using STAR methodology) for communication flow.\"\n" +
                "  ]\n" +
                "}";
    }
}
