package com.nexhire.portal.service;

import com.nexhire.portal.dto.response.NewsResponse;
import com.nexhire.portal.dto.response.PageResponse;
import com.nexhire.portal.entity.NewsArticle;
import com.nexhire.portal.repository.NewsArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class NewsService {
    private final NewsArticleRepository repo;

    @Transactional(readOnly = true)
    public PageResponse<NewsResponse> getAll(String category, int page, int size) {
        Pageable p = PageRequest.of(page, size);
        Page<NewsArticle> result = category != null && !category.isBlank()
                ? repo.findByCategoryOrderByPublishedAtDesc(category, p)
                : repo.findAllByOrderByPublishedAtDesc(p);
        return PageResponse.<NewsResponse>builder()
                .content(result.getContent().stream().map(this::map).toList())
                .page(result.getNumber()).size(result.getSize())
                .totalElements(result.getTotalElements()).totalPages(result.getTotalPages())
                .first(result.isFirst()).last(result.isLast()).build();
    }

    @Transactional(readOnly = true)
    public List<NewsResponse> getFeatured() {
        return repo.findTop6ByIsFeaturedTrueOrderByPublishedAtDesc().stream().map(this::map).toList();
    }

    private NewsResponse map(NewsArticle a) {
        return NewsResponse.builder()
                .id(a.getId()).title(a.getTitle()).summary(a.getSummary())
                .url(a.getUrl()).source(a.getSource()).category(a.getCategory())
                .imageUrl(a.getImageUrl()).isFeatured(a.getIsFeatured())
                .publishedAt(a.getPublishedAt()).createdAt(a.getCreatedAt())
                .build();
    }
}
