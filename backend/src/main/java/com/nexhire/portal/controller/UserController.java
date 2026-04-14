package com.nexhire.portal.controller;

import com.nexhire.portal.dto.response.ApiResponse;
import com.nexhire.portal.dto.response.JobResponse;
import com.nexhire.portal.dto.response.PageResponse;
import com.nexhire.portal.dto.response.UserResponse;
import com.nexhire.portal.service.SavedJobService;
import com.nexhire.portal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SavedJobService savedJobService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(userService.getProfile(auth.getName())));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @RequestBody UserService.UserProfileUpdateRequest request, Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                userService.updateProfile(auth.getName(), request)));
    }

    @GetMapping("/me/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(userService.getDashboardStats(auth.getName())));
    }

    @GetMapping("/me/recruiter-stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRecruiterStats(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(userService.getRecruiterStats(auth.getName())));
    }

    @PostMapping("/me/saved-jobs/{jobId}")
    public ResponseEntity<ApiResponse<Boolean>> toggleSave(@PathVariable Long jobId, Authentication auth) {
        boolean saved = savedJobService.toggleSave(jobId, auth.getName());
        return ResponseEntity.ok(ApiResponse.success(saved ? "Job saved" : "Job unsaved", saved));
    }

    @GetMapping("/me/saved-jobs")
    public ResponseEntity<ApiResponse<PageResponse<JobResponse>>> savedJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success(savedJobService.getSavedJobs(auth.getName(), page, size)));
    }
}
