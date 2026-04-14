package com.nexhire.portal.controller;

import com.nexhire.portal.dto.request.JobRequest;
import com.nexhire.portal.dto.response.*;
import com.nexhire.portal.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<JobResponse>>> search(
            @RequestParam(required=false) String keyword,
            @RequestParam(required=false) String location,
            @RequestParam(required=false) String jobType,
            @RequestParam(required=false) String workMode,
            @RequestParam(required=false) String experienceLevel,
            @RequestParam(required=false) String industry,
            @RequestParam(required=false) Double salaryMin,
            @RequestParam(required=false) Double salaryMax,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="12") int size,
            @RequestParam(required=false) String sortBy,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
            jobService.searchJobs(keyword, location, jobType, workMode,
                experienceLevel, industry, salaryMin, salaryMax, page, size, sortBy, auth)));
    }

    // ⚠️ MUST come BEFORE /{id} to avoid routing conflict
    @GetMapping("/my-postings")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<PageResponse<JobResponse>>> myPostings(
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="10") int size,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(jobService.getRecruiterJobs(auth.getName(), page, size)));
    }

    @GetMapping("/recommended")
    public ResponseEntity<ApiResponse<List<JobResponse>>> recommended(
            @RequestParam(defaultValue="6") int limit,
            Authentication auth) {
        String email = (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName()))
                ? auth.getName() : null;
        return ResponseEntity.ok(ApiResponse.success(jobService.getRecommended(email, limit)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJob(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(jobService.getById(id, auth)));
    }

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<JobResponse>> create(
            @Valid @RequestBody JobRequest req, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job posted successfully", jobService.create(req, auth.getName())));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<JobResponse>> update(
            @PathVariable Long id, @Valid @RequestBody JobRequest req, Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Job updated", jobService.update(id, req, auth.getName())));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id, Authentication auth) {
        jobService.delete(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Job deleted", null));
    }
}
