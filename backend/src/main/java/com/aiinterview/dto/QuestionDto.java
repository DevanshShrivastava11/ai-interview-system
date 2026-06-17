package com.aiinterview.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionDto {
    private Long id;
    private String questionText;
    private String answerText; // Optional, set if already answered
}
