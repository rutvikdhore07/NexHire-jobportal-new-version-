package com.nexhire.portal.dto.response;

import com.nexhire.portal.entity.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ApplicationResponse {
    private Long id;
    private Long jobId;
    private String jobTitle;
    private String company;
    private String location;
    private Long userId;
    private String userName;
    private String userEmail;
    private String coverLetter;
    private String resumeUrl;
    private ApplicationStatus status;
    private String recruiterNotes;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
