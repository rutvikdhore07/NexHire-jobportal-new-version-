package com.nexhire.portal.repository;

import com.nexhire.portal.entity.NewsArticle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
    Page<NewsArticle> findAllByOrderByPublishedAtDesc(Pageable pageable);
    Page<NewsArticle> findByCategoryOrderByPublishedAtDesc(String category, Pageable pageable);
    List<NewsArticle> findTop6ByIsFeaturedTrueOrderByPublishedAtDesc();
}
