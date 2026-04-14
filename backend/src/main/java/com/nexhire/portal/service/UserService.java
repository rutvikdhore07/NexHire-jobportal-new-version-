package com.nexhire.portal.service;

import com.nexhire.portal.dto.response.UserResponse;
import com.nexhire.portal.entity.User;
import com.nexhire.portal.entity.enums.ApplicationStatus;
import com.nexhire.portal.exception.ResourceNotFoundException;
import com.nexhire.portal.repository.ApplicationRepository;
import com.nexhire.portal.repository.JobRepository;
import com.nexhire.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    @Transactional(readOnly = true)
    public UserResponse getProfile(String email) {
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return AuthService.mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String email, UserProfileUpdateRequest req) {
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (req.getName() != null)        user.setName(req.getName());
        if (req.getPhone() != null)       user.setPhone(req.getPhone());
        if (req.getBio() != null)         user.setBio(req.getBio());
        if (req.getLocation() != null)    user.setLocation(req.getLocation());
        if (req.getSkills() != null)      user.setSkills(req.getSkills());
        if (req.getResumeUrl() != null)   user.setResumeUrl(req.getResumeUrl());
        if (req.getLinkedinUrl() != null) user.setLinkedinUrl(req.getLinkedinUrl());
        if (req.getGithubUrl() != null)   user.setGithubUrl(req.getGithubUrl());
        if (req.getPortfolioUrl() != null)user.setPortfolioUrl(req.getPortfolioUrl());

        user.setProfileComplete(user.getName() != null && user.getPhone() != null
                && user.getSkills() != null && user.getLocation() != null);
        return AuthService.mapToUserResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats(String email) {
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        long total       = applicationRepository.countByUserId(user.getId());
        long shortlisted = applicationRepository.countByUserIdAndStatus(user.getId(), ApplicationStatus.SHORTLISTED);
        long offered     = applicationRepository.countByUserIdAndStatus(user.getId(), ApplicationStatus.OFFERED);
        long rejected    = applicationRepository.countByUserIdAndStatus(user.getId(), ApplicationStatus.REJECTED);
        return Map.of(
                "totalApplications", total, "shortlisted", shortlisted,
                "offered", offered, "rejected", rejected,
                "profileComplete", Boolean.TRUE.equals(user.getProfileComplete()));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getRecruiterStats(String email) {
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        long activeJobs  = jobRepository.countByCreatedByIdAndIsActiveTrue(user.getId());
        // Safe count — handles case where user has no applications yet
        long totalApps;
        try {
            totalApps = applicationRepository.countByRecruiterId(user.getId());
        } catch (Exception e) {
            totalApps = 0L;
        }
        return Map.of("activeJobs", activeJobs, "totalApplicationsReceived", totalApps);
    }

    @lombok.Data
    public static class UserProfileUpdateRequest {
        private String name, phone, bio, location, skills;
        private String resumeUrl, linkedinUrl, githubUrl, portfolioUrl;
    }
}
