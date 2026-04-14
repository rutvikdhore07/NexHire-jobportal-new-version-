package com.nexhire.portal.service;

import com.nexhire.portal.dto.request.ApplicationRequest;
import com.nexhire.portal.dto.response.ApplicationResponse;
import com.nexhire.portal.dto.response.PageResponse;
import com.nexhire.portal.entity.Application;
import com.nexhire.portal.entity.Job;
import com.nexhire.portal.entity.User;
import com.nexhire.portal.entity.enums.ApplicationStatus;
import com.nexhire.portal.exception.AccessDeniedException;
import com.nexhire.portal.exception.BusinessException;
import com.nexhire.portal.exception.ResourceNotFoundException;
import com.nexhire.portal.repository.ApplicationRepository;
import com.nexhire.portal.repository.JobRepository;
import com.nexhire.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    @Transactional
    public ApplicationResponse apply(ApplicationRequest request, String userEmail) {
        User user = userRepository.findByEmailAndIsActiveTrue(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", request.getJobId()));

        if (Boolean.FALSE.equals(job.getIsActive()))
            throw new BusinessException("This job posting is no longer active");
        if (applicationRepository.existsByUserIdAndJobId(user.getId(), job.getId()))
            throw new BusinessException("You have already applied for this position");

        Application app = Application.builder()
                .user(user).job(job).coverLetter(request.getCoverLetter())
                .resumeUrl(request.getResumeUrl()).status(ApplicationStatus.APPLIED).build();

        Application saved = applicationRepository.save(app);
        log.info("User {} applied to job {}", userEmail, job.getId());
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<ApplicationResponse> getUserApplications(String email, int page, int size) {
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Page<Application> apps = applicationRepository
                .findByUserIdOrderByAppliedAtDesc(user.getId(), PageRequest.of(page, size));
        return buildPageResponse(apps);
    }

    @Transactional(readOnly = true)
    public PageResponse<ApplicationResponse> getJobApplications(Long jobId, String recruiterEmail, int page, int size) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", jobId));
        if (!job.getCreatedBy().getEmail().equals(recruiterEmail))
            throw new AccessDeniedException("You are not authorized to view these applications");
        Page<Application> apps = applicationRepository
                .findByJobIdOrderByAppliedAtDesc(jobId, PageRequest.of(page, size));
        return buildPageResponse(apps);
    }

    @Transactional
    public ApplicationResponse updateStatus(Long appId, String status, String recruiterEmail, String notes) {
        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", appId));
        if (!app.getJob().getCreatedBy().getEmail().equals(recruiterEmail))
            throw new AccessDeniedException("You are not authorized to update this application");
        try { app.setStatus(ApplicationStatus.valueOf(status.toUpperCase())); }
        catch (IllegalArgumentException e) { throw new BusinessException("Invalid status: " + status); }
        if (notes != null && !notes.isBlank()) app.setRecruiterNotes(notes);
        log.info("Application {} status → {} by {}", appId, status, recruiterEmail);
        return mapToResponse(applicationRepository.save(app));
    }

    @Transactional
    public void withdraw(Long appId, String userEmail) {
        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", appId));
        if (!app.getUser().getEmail().equals(userEmail))
            throw new AccessDeniedException("You can only withdraw your own applications");
        if (app.getStatus() == ApplicationStatus.OFFERED)
            throw new BusinessException("Cannot withdraw after receiving an offer");
        app.setStatus(ApplicationStatus.WITHDRAWN);
        applicationRepository.save(app);
    }

    private PageResponse<ApplicationResponse> buildPageResponse(Page<Application> apps) {
        return PageResponse.<ApplicationResponse>builder()
                .content(apps.getContent().stream().map(this::mapToResponse).toList())
                .page(apps.getNumber()).size(apps.getSize())
                .totalElements(apps.getTotalElements()).totalPages(apps.getTotalPages())
                .first(apps.isFirst()).last(apps.isLast()).build();
    }

    private ApplicationResponse mapToResponse(Application app) {
        return ApplicationResponse.builder()
                .id(app.getId()).jobId(app.getJob().getId()).jobTitle(app.getJob().getTitle())
                .company(app.getJob().getCompany()).location(app.getJob().getLocation())
                .userId(app.getUser().getId()).userName(app.getUser().getName())
                .userEmail(app.getUser().getEmail()).coverLetter(app.getCoverLetter())
                .resumeUrl(app.getResumeUrl()).status(app.getStatus())
                .recruiterNotes(app.getRecruiterNotes())
                .appliedAt(app.getAppliedAt()).updatedAt(app.getUpdatedAt()).build();
    }
}
