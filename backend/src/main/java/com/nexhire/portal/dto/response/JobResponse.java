package com.nexhire.portal.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String company;
    private String location;
    private Double salaryMin;
    private Double salaryMax;
    private String description;
    private String skillsRequired;
    private String jobType;
    private String experienceLevel;
    private String workMode;
    private String industry;
    private LocalDate applicationDeadline;
    private Integer openings;
    private Boolean isActive;
    private RecruiterInfo postedBy;
    private Integer applicationCount;
    private Boolean isSaved;
    private Boolean hasApplied;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    public static class RecruiterInfo {
        private Long id;
        private String name;
        private String email;
    }
}
