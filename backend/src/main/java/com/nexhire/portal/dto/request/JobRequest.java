package com.nexhire.portal.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class JobRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "Company name is required")
    @Size(max = 200)
    private String company;

    @NotBlank(message = "Location is required")
    @Size(max = 200)
    private String location;

    @Positive(message = "Minimum salary must be positive")
    private Double salaryMin;

    @Positive(message = "Maximum salary must be positive")
    private Double salaryMax;

    @NotBlank(message = "Description is required")
    private String description;

    @Size(max = 500)
    private String skillsRequired;

    private String jobType;

    private String experienceLevel;

    private String workMode;

    private String industry;

    private LocalDate applicationDeadline;

    private Integer openings;
}
