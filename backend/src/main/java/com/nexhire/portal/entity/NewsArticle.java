package com.nexhire.portal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "news_articles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NewsArticle {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(length = 500)
    private String url;

    @Column(length = 100)
    private String source;

    @Column(length = 100)
    private String category;     // Hiring, Tech, Layoffs, Startups, Skills

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean isFeatured = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
