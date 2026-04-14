package com.nexhire.portal.dto.response;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class CourseResponse {
    private Long id;
    private String title, provider, description, url;
    private String category, level, price;
    private Integer durationHours, enrolledCount;
    private String imageUrl;
    private Double rating;
    private Boolean isFeatured;
    private LocalDateTime createdAt;
}
