package com.nexhire.portal.service;

import com.nexhire.portal.dto.response.JobResponse;
import com.nexhire.portal.dto.response.PageResponse;
import com.nexhire.portal.entity.Job;
import com.nexhire.portal.entity.SavedJob;
import com.nexhire.portal.entity.User;
import com.nexhire.portal.exception.BusinessException;
import com.nexhire.portal.exception.ResourceNotFoundException;
import com.nexhire.portal.repository.ApplicationRepository;
import com.nexhire.portal.repository.JobRepository;
import com.nexhire.portal.repository.SavedJobRepository;
import com.nexhire.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional
    public boolean toggleSave(Long jobId, String email) {
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", jobId));

        if (savedJobRepository.existsByUserIdAndJobId(user.getId(), jobId)) {
            savedJobRepository.deleteByUserIdAndJobId(user.getId(), jobId);
            return false;
        } else {
            savedJobRepository.save(SavedJob.builder().user(user).job(job).build());
            return true;
        }
    }

    public PageResponse<JobResponse> getSavedJobs(String email, int page, int size) {
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Page<SavedJob> saved = savedJobRepository
                .findByUserIdOrderBySavedAtDesc(user.getId(), PageRequest.of(page, size));

        return PageResponse.<JobResponse>builder()
                .content(saved.getContent().stream().map(s -> mapJob(s.getJob(), user.getId())).toList())
                .page(saved.getNumber()).size(saved.getSize())
                .totalElements(saved.getTotalElements())
                .totalPages(saved.getTotalPages())
                .first(saved.isFirst()).last(saved.isLast())
                .build();
    }

    private JobResponse mapJob(Job job, Long userId) {
        long appCount = applicationRepository.countByJobId(job.getId());
        boolean hasApplied = applicationRepository.existsByUserIdAndJobId(userId, job.getId());
        return JobResponse.builder()
                .id(job.getId()).title(job.getTitle()).company(job.getCompany())
                .location(job.getLocation()).salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax()).jobType(job.getJobType())
                .workMode(job.getWorkMode()).experienceLevel(job.getExperienceLevel())
                .skillsRequired(job.getSkillsRequired()).isActive(job.getIsActive())
                .applicationCount((int) appCount).isSaved(true).hasApplied(hasApplied)
                .createdAt(job.getCreatedAt()).build();
    }
}
