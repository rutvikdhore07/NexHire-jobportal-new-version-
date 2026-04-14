package com.nexhire.portal.ai;

import com.nexhire.portal.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final GeminiService geminiService;

    /** AI Chatbot — career / job query */
    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<Map<String, String>>> chat(
            @RequestBody Map<String, String> body, Authentication auth) {
        String message = body.getOrDefault("message", "");
        String userContext = auth != null ? auth.getName() : "guest";
        String reply = geminiService.chat(message, userContext);
        return ResponseEntity.ok(ApiResponse.success(Map.of("reply", reply)));
    }

    /** Analyze resume text (send raw text from PDF parsing on frontend) */
    @PostMapping("/resume-analyze")
    public ResponseEntity<ApiResponse<Map<String, Object>>> analyzeResume(
            @RequestBody Map<String, String> body) {
        String resumeText = body.getOrDefault("text", "");
        Map<String, Object> analysis = geminiService.analyzeResume(resumeText);
        return ResponseEntity.ok(ApiResponse.success(analysis));
    }

    /** Job match score for a user's skills vs job description */
    @PostMapping("/job-match")
    public ResponseEntity<ApiResponse<Map<String, Object>>> jobMatch(
            @RequestBody Map<String, String> body) {
        String skills = body.getOrDefault("skills", "");
        String jobDesc = body.getOrDefault("jobDescription", "");
        Map<String, Object> result = geminiService.getJobMatchScore(skills, jobDesc);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
