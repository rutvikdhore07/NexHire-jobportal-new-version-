package com.nexhire.portal.controller;

import com.nexhire.portal.dto.response.*;
import com.nexhire.portal.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/skills") @RequiredArgsConstructor
public class SkillController {
    private final SkillService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SkillResponse>>> all(
            @RequestParam(required=false) String category) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(category)));
    }

    @GetMapping("/hot")
    public ResponseEntity<ApiResponse<List<SkillResponse>>> hot() {
        return ResponseEntity.ok(ApiResponse.success(service.getHotSkills()));
    }
}
