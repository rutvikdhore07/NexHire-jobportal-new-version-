package com.nexhire.portal.dto.response;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class NewsResponse {
    private Long id;
    private String title, summary, url, source, category, imageUrl;
    private Boolean isFeatured;
    private LocalDateTime publishedAt, createdAt;
}
