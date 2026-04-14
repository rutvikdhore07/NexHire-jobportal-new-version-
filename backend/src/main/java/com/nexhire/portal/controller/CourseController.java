package com.nexhire.portal.controller;

import com.nexhire.portal.dto.response.*;
import com.nexhire.portal.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/courses") @RequiredArgsConstructor
public class CourseController {
    private final CourseService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CourseResponse>>> search(
            @RequestParam(required=false) String keyword,
            @RequestParam(required=false) String category,
            @RequestParam(required=false) String level,
            @RequestParam(required=false) String price,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="12") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.search(keyword, category, level, price, page, size)));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<CourseResponse>>> featured() {
        return ResponseEntity.ok(ApiResponse.success(service.getFeatured()));
    }
}
