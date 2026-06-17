package com.aiinterview.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewSetupRequest {
    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Difficulty is required")
    private String difficulty;
}
