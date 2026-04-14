package com.nexhire.portal.controller;

import com.nexhire.portal.dto.response.*;
import com.nexhire.portal.service.NewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/news") @RequiredArgsConstructor
public class NewsController {
    private final NewsService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<NewsResponse>>> all(
            @RequestParam(required=false) String category,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="12") int size) {
        return ResponseEntity.ok(ApiResponse.success(service.getAll(category, page, size)));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<NewsResponse>>> featured() {
        return ResponseEntity.ok(ApiResponse.success(service.getFeatured()));
    }
}
