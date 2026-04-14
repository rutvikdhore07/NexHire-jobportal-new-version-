package com.nexhire.portal.service;

import com.nexhire.portal.dto.request.JobRequest;
import com.nexhire.portal.dto.response.JobResponse;
import com.nexhire.portal.dto.response.PageResponse;
import com.nexhire.portal.entity.Job;
import com.nexhire.portal.entity.User;
import com.nexhire.portal.exception.AccessDeniedException;
import com.nexhire.portal.exception.ResourceNotFoundException;
import com.nexhire.portal.repository.ApplicationRepository;
import com.nexhire.portal.repository.JobRepository;
import com.nexhire.portal.repository.SavedJobRepository;
import com.nexhire.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;

    @Transactional(readOnly = true)
    @Cacheable(value = "jobs", key = "#keyword + '-' + #location + '-' + #page + '-' + #size")
    public PageResponse<JobResponse> searchJobs(
            String keyword, String location, String jobType,
            String workMode, String experienceLevel, String industry,
            Double salaryMin, Double salaryMax,
            int page, int size, String sortBy, Authentication auth) {

        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, sortBy != null ? sortBy : "createdAt"));

        Page<Job> jobs = jobRepository.searchJobs(
                keyword, location, jobType, workMode, experienceLevel,
                industry, salaryMin, salaryMax, pageable);

        Long userId = getUserIdFromAuth(auth);

        return PageResponse.<JobResponse>builder()
                .content(jobs.getContent().stream().map(j -> mapToResponse(j, userId)).toList())
                .page(jobs.getNumber()).size(jobs.getSize())
                .totalElements(jobs.getTotalElements()).totalPages(jobs.getTotalPages())
                .first(jobs.isFirst()).last(jobs.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "jobDetails", key = "#id")
    public JobResponse getById(Long id, Authentication auth) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", id));
        Long userId = getUserIdFromAuth(auth);
        return mapToResponse(job, userId);
    }

    @Transactional
    @CacheEvict(value = {"jobs", "jobDetails"}, allEntries = true)
    public JobResponse create(JobRequest request, String email) {
        User recruiter = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = Job.builder()
                .title(request.getTitle()).company(request.getCompany())
                .location(request.getLocation()).salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax()).description(request.getDescription())
                .skillsRequired(request.getSkillsRequired()).jobType(request.getJobType())
                .experienceLevel(request.getExperienceLevel()).workMode(request.getWorkMode())
                .industry(request.getIndustry()).applicationDeadline(request.getApplicationDeadline())
                .openings(request.getOpenings() != null ? request.getOpenings() : 1)
                .isActive(true).createdBy(recruiter).build();

        Job saved = jobRepository.save(job);
        log.info("Job created: '{}' by recruiter {}", saved.getTitle(), email);
        return mapToResponse(saved, null);
    }

    @Transactional
    @CacheEvict(value = {"jobs", "jobDetails"}, allEntries = true)
    public JobResponse update(Long id, JobRequest request, String email) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", id));
        if (!job.getCreatedBy().getEmail().equals(email))
            throw new AccessDeniedException("You can only edit your own job postings");

        job.setTitle(request.getTitle()); job.setCompany(request.getCompany());
        job.setLocation(request.getLocation()); job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax()); job.setDescription(request.getDescription());
        job.setSkillsRequired(request.getSkillsRequired()); job.setJobType(request.getJobType());
        job.setExperienceLevel(request.getExperienceLevel()); job.setWorkMode(request.getWorkMode());
        job.setIndustry(request.getIndustry()); job.setApplicationDeadline(request.getApplicationDeadline());
        if (request.getOpenings() != null) job.setOpenings(request.getOpenings());
        return mapToResponse(jobRepository.save(job), null);
    }

    @Transactional
    @CacheEvict(value = {"jobs", "jobDetails"}, allEntries = true)
    public void delete(Long id, String email) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", id));
        if (!job.getCreatedBy().getEmail().equals(email))
            throw new AccessDeniedException("You can only delete your own job postings");
        applicationRepository.deleteByJobId(id);
        jobRepository.delete(job);
        log.info("Job {} deleted by {}", id, email);
    }

    @Transactional(readOnly = true)
    public PageResponse<JobResponse> getRecruiterJobs(String email, int page, int size) {
        User recruiter = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Job> jobs = jobRepository.findByCreatedByIdAndIsActiveTrue(recruiter.getId(), pageable);
        return PageResponse.<JobResponse>builder()
                .content(jobs.getContent().stream().map(j -> mapToResponse(j, null)).toList())
                .page(jobs.getNumber()).size(jobs.getSize())
                .totalElements(jobs.getTotalElements()).totalPages(jobs.getTotalPages())
                .first(jobs.isFirst()).last(jobs.isLast()).build();
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getRecommended(String email, int limit) {
        User user = userRepository.findByEmailAndIsActiveTrue(email).orElse(null);
        if (user == null || user.getSkills() == null || user.getSkills().isBlank()) {
            // Return latest jobs if no profile
            return jobRepository.searchJobs(null, null, null, null, null, null, null, null,
                    PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt")))
                    .getContent().stream().map(j -> mapToResponse(j, user != null ? user.getId() : null)).toList();
        }
        // Simple skill-based recommendation: search by first skill keyword
        String firstSkill = user.getSkills().split("[,;]")[0].trim();
        return jobRepository.searchJobs(firstSkill, user.getLocation(), null, null, null, null, null, null,
                PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt")))
                .getContent().stream().map(j -> mapToResponse(j, user.getId())).toList();
    }

    // ── mapper ─────────────────────────────────────────────────────────
    private JobResponse mapToResponse(Job job, Long userId) {
        long appCount = applicationRepository.countByJobId(job.getId());
        boolean isSaved = userId != null && savedJobRepository.existsByUserIdAndJobId(userId, job.getId());
        boolean hasApplied = userId != null && applicationRepository.existsByUserIdAndJobId(userId, job.getId());

        User createdBy = job.getCreatedBy();
        return JobResponse.builder()
                .id(job.getId()).title(job.getTitle()).company(job.getCompany())
                .location(job.getLocation()).salaryMin(job.getSalaryMin()).salaryMax(job.getSalaryMax())
                .description(job.getDescription()).skillsRequired(job.getSkillsRequired())
                .jobType(job.getJobType()).experienceLevel(job.getExperienceLevel())
                .workMode(job.getWorkMode()).industry(job.getIndustry())
                .applicationDeadline(job.getApplicationDeadline()).openings(job.getOpenings())
                .isActive(job.getIsActive())
                .postedBy(createdBy != null ? JobResponse.RecruiterInfo.builder()
                        .id(createdBy.getId()).name(createdBy.getName()).email(createdBy.getEmail())
                        .build() : null)
                .applicationCount((int) appCount).isSaved(isSaved).hasApplied(hasApplied)
                .createdAt(job.getCreatedAt()).updatedAt(job.getUpdatedAt())
                .build();
    }

    private Long getUserIdFromAuth(Authentication auth) {
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) return null;
        return userRepository.findByEmailAndIsActiveTrue(auth.getName()).map(User::getId).orElse(null);
    }
}
