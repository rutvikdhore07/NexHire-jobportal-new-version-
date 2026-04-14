package com.nexhire.portal.repository;

import com.nexhire.portal.entity.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Page<Course> findByCategory(String category, Pageable pageable);
    Page<Course> findByLevel(String level, Pageable pageable);
    List<Course> findByIsFeaturedTrueOrderByRatingDesc();

    @Query("SELECT c FROM Course c WHERE " +
       "(:keyword IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')) " +
       "OR LOWER(c.provider) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))) " +
       "AND (:category IS NULL OR c.category = :category) " +
       "AND (:level IS NULL OR c.level = :level) " +
       "AND (:price IS NULL OR c.price = :price)")
    Page<Course> search(@Param("keyword") String keyword,
                        @Param("category") String category,
                        @Param("level") String level,
                        @Param("price") String price,
                        Pageable pageable);
}
