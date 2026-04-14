package com.nexhire.portal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "courses")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 200)
    private String provider;      // Udemy, Coursera, YouTube, etc.

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 300)
    private String url;

    @Column(length = 100)
    private String category;      // Frontend, Backend, DevOps, Data Science …

    @Column(length = 50)
    private String level;         // Beginner, Intermediate, Advanced

    @Column(length = 50)
    private String price;         // Free, Paid, Freemium

    @Column(name = "duration_hours")
    private Integer durationHours;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "enrolled_count")
    private Integer enrolledCount;

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean isFeatured = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
