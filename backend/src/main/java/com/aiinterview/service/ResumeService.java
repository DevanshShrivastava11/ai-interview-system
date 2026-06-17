package com.aiinterview.service;

import com.aiinterview.entity.Resume;
import com.aiinterview.entity.User;
import com.aiinterview.repository.ResumeRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ResumeService {

    private static final Logger logger = LoggerFactory.getLogger(ResumeService.class);

    @Value("${app.upload.dir}")
    private String uploadDir;

    private final ResumeRepository resumeRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResumeService(ResumeRepository resumeRepository, GeminiService geminiService) {
        this.resumeRepository = resumeRepository;
        this.geminiService = geminiService;
    }

    @Transactional
    public Resume uploadAndAnalyzeResume(User user, MultipartFile file) throws IOException {
        // Create upload directory if it does not exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename to avoid duplicates/collisions
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        Path filePath = uploadPath.resolve(uniqueFileName);

        // Save file locally
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        logger.info("Saved resume to path: {}", filePath);

        // Extract text from PDF
        String extractedText = "";
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            extractedText = stripper.getText(document);
        } catch (Exception e) {
            logger.error("Failed to parse PDF content via PDFBox", e);
            throw new RuntimeException("Unable to read PDF file contents. Please upload a valid PDF resume.", e);
        }

        // Send text to Gemini for skills/recommends analysis
        String analysisJson = geminiService.analyzeResume(extractedText);
        
        String skills = "";
        String missingSkills = "";
        String recommendations = "";

        try {
            JsonNode analysis = objectMapper.readTree(analysisJson);
            skills = analysis.path("skills").toString();
            missingSkills = analysis.path("missingSkills").toString();
            recommendations = analysis.path("recommendations").toString();
        } catch (Exception e) {
            logger.error("Failed to parse Gemini analysis JSON response, saving raw response string instead", e);
            skills = analysisJson;
        }

        Resume resume = Resume.builder()
                .user(user)
                .fileName(originalFileName)
                .filePath(filePath.toString())
                .skills(skills)
                .missingSkills(missingSkills)
                .recommendations(recommendations)
                .build();

        return resumeRepository.save(resume);
    }

    public Optional<Resume> getLatestResume(Long userId) {
        return resumeRepository.findFirstByUserIdOrderByUploadedAtDesc(userId);
    }

    public List<Resume> getAllResumes(Long userId) {
        return resumeRepository.findByUserIdOrderByUploadedAtDesc(userId);
    }
}
