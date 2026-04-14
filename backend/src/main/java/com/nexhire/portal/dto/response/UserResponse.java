package com.nexhire.portal.dto.response;

import com.nexhire.portal.entity.enums.Role;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String phone;
    private String bio;
    private String location;
    private String skills;
    private String resumeUrl;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private Boolean profileComplete;
    private LocalDateTime createdAt;
}
