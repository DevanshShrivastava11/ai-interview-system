package com.aiinterview.service;

import com.aiinterview.entity.Answer;
import com.aiinterview.entity.Interview;
import com.aiinterview.entity.Question;
import com.aiinterview.entity.Result;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PdfReportService {

    private static final Logger logger = LoggerFactory.getLogger(PdfReportService.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    public byte[] generateInterviewReport(Interview interview, List<Question> questions, List<Answer> answers,
            Result result) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 54, 36);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Font configurations
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.DARK_GRAY);
            Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.GRAY);
            Font sectionTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(41, 128, 185)); // Accent
                                                                                                                  // Blue
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK);
            Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.DARK_GRAY);
            Font boldTextFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.DARK_GRAY);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.DARK_GRAY);

            // Document Header
            Paragraph title = new Paragraph("AI Interview System - Evaluation Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(4);
            document.add(title);

            Paragraph subtitle = new Paragraph("Generated on " +
                    interview.getStartedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")), subtitleFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            // Basic Information Section
            Paragraph sec1 = new Paragraph("1. Candidate & Interview Information", sectionTitleFont);
            sec1.setSpacingAfter(10);
            document.add(sec1);

            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingAfter(15);
            infoTable.setWidths(new float[] { 1f, 1f });

            addTableCell(infoTable, "Candidate Name:", interview.getUser().getName(), labelFont, valueFont);
            addTableCell(infoTable, "Candidate Email:", interview.getUser().getEmail(), labelFont, valueFont);
            addTableCell(infoTable, "Domain Category:", interview.getCategory(), labelFont, valueFont);
            addTableCell(infoTable, "Difficulty Level:", interview.getDifficulty(), labelFont, valueFont);

            document.add(infoTable);

            // Scores Summary
            Paragraph sec2 = new Paragraph("2. AI Evaluation Scores Summary", sectionTitleFont);
            sec2.setSpacingAfter(10);
            document.add(sec2);

            PdfPTable scoreTable = new PdfPTable(3);
            scoreTable.setWidthPercentage(100);
            scoreTable.setSpacingAfter(15);
            scoreTable.setWidths(new float[] { 1f, 1f, 1f });

            addScoreCard(scoreTable, "Technical Score", String.valueOf(result.getTechnicalScore()) + "/10",
                    boldTextFont);
            addScoreCard(scoreTable, "Communication Score", String.valueOf(result.getCommunicationScore()) + "/10",
                    boldTextFont);
            addScoreCard(scoreTable, "Overall Score", String.valueOf(result.getOverallScore()) + "/10", boldTextFont);

            document.add(scoreTable);

            // Overall Feedback
            Paragraph sec3 = new Paragraph("3. Detailed Overall Feedback", sectionTitleFont);
            sec3.setSpacingAfter(6);
            document.add(sec3);

            Paragraph feedbackPara = new Paragraph(result.getFeedback(), valueFont);
            feedbackPara.setSpacingAfter(15);
            document.add(feedbackPara);

            // Strengths, Weaknesses, Recommendations
            PdfPTable feedbackGrid = new PdfPTable(1);
            feedbackGrid.setWidthPercentage(100);
            feedbackGrid.setSpacingAfter(15);

            addFeedbackSection(feedbackGrid, "Key Strengths", result.getStrengths(), boldTextFont, valueFont);
            addFeedbackSection(feedbackGrid, "Areas of Weakness", result.getWeaknesses(), boldTextFont, valueFont);
            addFeedbackSection(feedbackGrid, "Improvement Suggestions", result.getImprovementSuggestions(),
                    boldTextFont, valueFont);

            document.add(feedbackGrid);

            // Interview Transcript Section
            document.add(Chunk.NEXTPAGE);

            Paragraph sec4 = new Paragraph("4. Full Interview Questions & Answers", sectionTitleFont);
            sec4.setSpacingAfter(15);
            document.add(sec4);

            Map<Long, Answer> answerMap = answers.stream()
                    .collect(Collectors.toMap(a -> a.getQuestion().getId(), a -> a));

            for (int i = 0; i < questions.size(); i++) {
                Question question = questions.get(i);
                Answer answer = answerMap.get(question.getId());

                Paragraph qPara = new Paragraph(String.format("Q%d: %s", i + 1, question.getQuestionText()),
                        boldTextFont);
                qPara.setSpacingBefore(10);
                qPara.setSpacingAfter(4);
                document.add(qPara);

                String answerText = (answer != null) ? answer.getAnswerText() : "[No Answer Submitted]";
                Paragraph aPara = new Paragraph(String.format("A%d: %s", i + 1, answerText), bodyFont);
                aPara.setIndentationLeft(15);
                aPara.setSpacingAfter(10);
                document.add(aPara);

                // Add a light separator line
                Paragraph separator = new Paragraph(
                        "--------------------------------------------------------------------------------------------------------------------------------",
                        FontFactory.getFont(FontFactory.HELVETICA, 8, Color.LIGHT_GRAY));
                separator.setSpacingAfter(5);
                document.add(separator);
            }

            document.close();
        } catch (Exception e) {
            logger.error("Failed to generate PDF Report", e);
            throw new RuntimeException("Could not generate PDF report", e);
        }

        return out.toByteArray();
    }

    private void addTableCell(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Paragraph(label, labelFont));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(5);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Paragraph(value, valueFont));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPadding(5);
        table.addCell(valueCell);
    }

    private void addScoreCard(PdfPTable table, String title, String score, Font font) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(10);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBackgroundColor(new Color(245, 247, 250));
        cell.setBorderColor(new Color(220, 224, 230));

        Paragraph titlePara = new Paragraph(title, FontFactory.getFont(FontFactory.HELVETICA, 9, Color.GRAY));
        titlePara.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(titlePara);

        Paragraph scorePara = new Paragraph(score,
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, new Color(41, 128, 185)));
        scorePara.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(scorePara);

        table.addCell(cell);
    }

    private void addFeedbackSection(PdfPTable table, String header, String itemsJson, Font headerFont, Font bodyFont) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(8);
        cell.setBackgroundColor(new Color(250, 250, 250));
        cell.setBorderColor(new Color(230, 230, 230));

        Paragraph title = new Paragraph(header, headerFont);
        title.setSpacingAfter(4);
        cell.addElement(title);

        try {
            // Check if JSON array, otherwise print raw text
            List<?> list = objectMapper.readValue(itemsJson, List.class);
            for (Object obj : list) {
                Paragraph p = new Paragraph("• " + obj.toString(), bodyFont);
                p.setIndentationLeft(10);
                cell.addElement(p);
            }
        } catch (Exception e) {
            // Fallback to plain string printing if JSON parsing fails
            Paragraph p = new Paragraph(itemsJson, bodyFont);
            p.setIndentationLeft(10);
            cell.addElement(p);
        }

        table.addCell(cell);
    }
}
