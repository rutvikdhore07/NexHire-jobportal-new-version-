package com.nexhire.portal.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
public class GeminiService {

    private static final String GROQ_URL =
        "https://api.groq.com/openai/v1/chat/completions";

    private static final String MODEL = "llama-3.3-70b-versatile";

    @Value("${GROQ_API_KEY:}") private String apiKey;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public String chat(String userMessage, String userContext) {
        if (apiKey == null || apiKey.isBlank()) return getFallbackChatReply(userMessage);
        String prompt = """
            You are NexHire AI — a helpful career assistant on a job portal.
            Help with: job searching, resume tips, interview prep, career advice.
            Keep responses concise (2-4 sentences max) and practical.
            User message: %s
            """.formatted(userMessage);
        return callGroq(prompt);
    }

    public Map<String, Object> analyzeResume(String resumeText) {
        if (resumeText == null || resumeText.isBlank())
            return Map.of("error", "Resume text is empty.");
        if (apiKey == null || apiKey.isBlank()) return getFallbackResumeAnalysis();

        String prompt = """
            Analyze this resume and return a JSON object with EXACTLY these fields:
            {
              "score": <number 0-100>,
              "skills": [<list of skills found>],
              "experienceYears": <number>,
              "strengths": [<2-3 key strengths>],
              "improvements": [<3-4 specific improvement suggestions>],
              "suggestedRoles": [<3 job titles this person should apply for>],
              "summary": "<2 sentence professional summary>"
            }
            Return ONLY the JSON, no markdown, no explanation.
            Resume text: %s
            """.formatted(resumeText.substring(0, Math.min(resumeText.length(), 3000)));

        String raw = callGroq(prompt);
        if (raw.startsWith("ERROR")) {
            log.error("Groq failed: {}", raw);
            return getFallbackResumeAnalysis();
        }
        try {
            String cleaned = raw.replaceAll("```json|```", "").trim();
            JsonNode node = mapper.readTree(cleaned);
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("score", node.path("score").asInt(65));
            result.put("skills", toList(node.path("skills")));
            result.put("experienceYears", node.path("experienceYears").asInt(0));
            result.put("strengths", toList(node.path("strengths")));
            result.put("improvements", toList(node.path("improvements")));
            result.put("suggestedRoles", toList(node.path("suggestedRoles")));
            result.put("summary", node.path("summary").asText(""));
            return result;
        } catch (Exception e) {
            log.warn("Could not parse Groq resume response: {}", e.getMessage());
            return getFallbackResumeAnalysis();
        }
    }

    public Map<String, Object> getJobMatchScore(String skills, String jobDescription) {
        if (apiKey == null || apiKey.isBlank())
            return Map.of("score", 70, "missing", List.of("Configure Groq API key"), "tips", List.of());

        String prompt = """
            Given these candidate skills: %s
            And this job description: %s
            Return JSON with:
            {
              "score": <match percentage 0-100>,
              "matched": [<skills that match>],
              "missing": [<required skills candidate lacks>],
              "tips": [<2 tips to improve match>]
            }
            Return ONLY JSON, no markdown.
            """.formatted(skills, jobDescription.substring(0, Math.min(jobDescription.length(), 1000)));

        String raw = callGroq(prompt);
        try {
            String cleaned = raw.replaceAll("```json|```", "").trim();
            JsonNode node = mapper.readTree(cleaned);
            return Map.of(
                "score", node.path("score").asInt(50),
                "matched", toList(node.path("matched")),
                "missing", toList(node.path("missing")),
                "tips", toList(node.path("tips"))
            );
        } catch (Exception e) {
            return Map.of("score", 60, "matched", List.of(), "missing", List.of(), "tips", List.of());
        }
    }

    private String callGroq(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);  // Groq uses Bearer token

            Map<String, Object> body = Map.of(
                "model", MODEL,
                "messages", List.of(
                    Map.of("role", "user", "content", prompt)
                ),
                "max_tokens", 1024,
                "temperature", 0.7
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(
                GROQ_URL, entity, String.class);

            JsonNode root = mapper.readTree(response.getBody());
            return root.path("choices").get(0)
                       .path("message").path("content").asText();
        } catch (Exception e) {
            log.warn("Groq API call failed: {}", e.getMessage());
            return "ERROR: " + e.getMessage();
        }
    }

    private List<String> toList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node.isArray()) node.forEach(n -> list.add(n.asText()));
        return list;
    }

    private String getFallbackChatReply(String msg) {
        String lower = msg.toLowerCase();
        if (lower.contains("resume"))   return "A great resume should be 1 page, use bullet points with action verbs, and quantify achievements (e.g., 'Increased sales by 30%'). Tailor it to each job description.";
        if (lower.contains("interview")) return "Prepare using the STAR method (Situation, Task, Action, Result). Research the company, practice common questions, and always prepare 2-3 questions to ask the interviewer.";
        if (lower.contains("salary"))   return "Research market rates on LinkedIn Salary, Glassdoor, and AmbitionBox. Always negotiate — most companies expect it.";
        if (lower.contains("skill"))    return "High-demand skills in 2025: React/Next.js, Python, AWS/Cloud, TypeScript, and AI/ML fundamentals. Focus on building projects you can show on GitHub.";
        return "I'm NexHire AI! I can help with resume tips, interview preparation, salary negotiation, and career guidance. What would you like to know?";
    }

    private Map<String, Object> getFallbackResumeAnalysis() {
        return Map.of(
            "score", 70,
            "skills", List.of("Configure Groq API key for real analysis"),
            "experienceYears", 0,
            "strengths", List.of("Resume submitted successfully"),
            "improvements", List.of(
                "Add GROQ_API_KEY in start.bat for real AI analysis",
                "Quantify achievements with numbers",
                "Use action verbs at the start of bullet points",
                "Tailor your resume to each job description"
            ),
            "suggestedRoles", List.of("Software Engineer", "Full Stack Developer", "Backend Developer"),
            "summary", "Configure GROQ_API_KEY in your start.bat for personalized AI resume analysis."
        );
    }
}