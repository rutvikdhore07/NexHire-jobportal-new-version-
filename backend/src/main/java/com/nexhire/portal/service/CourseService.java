package com.nexhire.portal.service;

import com.nexhire.portal.dto.response.CourseResponse;
import com.nexhire.portal.dto.response.PageResponse;
import com.nexhire.portal.entity.Course;
import com.nexhire.portal.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;


@Service @RequiredArgsConstructor
public class CourseService {
    private final CourseRepository repo;

    @Transactional(readOnly = true)
    public PageResponse<CourseResponse> search(String keyword, String category,
                                                String level, String price, int page, int size) {
        Pageable p = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "rating"));
        Page<Course> result = repo.search(keyword, category, level, price, p);
        return PageResponse.<CourseResponse>builder()
                .content(result.getContent().stream().map(this::map).toList())
                .page(result.getNumber()).size(result.getSize())
                .totalElements(result.getTotalElements()).totalPages(result.getTotalPages())
                .first(result.isFirst()).last(result.isLast()).build();
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getFeatured() {
        return repo.findByIsFeaturedTrueOrderByRatingDesc().stream().map(this::map).toList();
    }

    private CourseResponse map(Course c) {
        return CourseResponse.builder()
                .id(c.getId()).title(c.getTitle()).provider(c.getProvider())
                .description(c.getDescription()).url(c.getUrl()).category(c.getCategory())
                .level(c.getLevel()).price(c.getPrice()).durationHours(c.getDurationHours())
                .enrolledCount(c.getEnrolledCount()).imageUrl(c.getImageUrl())
                .rating(c.getRating()).isFeatured(c.getIsFeatured()).createdAt(c.getCreatedAt())
                .build();
    }
}
