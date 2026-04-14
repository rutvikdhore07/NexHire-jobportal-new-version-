package com.nexhire.portal.controller;

import com.nexhire.portal.dto.request.ApplicationRequest;
import com.nexhire.portal.dto.response.ApiResponse;
import com.nexhire.portal.dto.response.ApplicationResponse;
import com.nexhire.portal.dto.response.PageResponse;
import com.nexhire.portal.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> apply(
            @Valid @RequestBody ApplicationRequest request, Authentication auth) {
        ApplicationResponse response = applicationService.apply(request, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted successfully", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PageResponse<ApplicationResponse>>> myApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
                applicationService.getUserApplications(auth.getName(), page, size)));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<PageResponse<ApplicationResponse>>> jobApplications(
            @PathVariable Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(
                applicationService.getJobApplications(jobId, auth.getName(), page, size)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String notes,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Status updated",
                applicationService.updateStatus(id, status, auth.getName(), notes)));
    }

    @PatchMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Void>> withdraw(@PathVariable Long id, Authentication auth) {
        applicationService.withdraw(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn", null));
    }
}
