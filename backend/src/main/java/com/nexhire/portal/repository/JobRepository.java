package com.nexhire.portal.repository;

import com.nexhire.portal.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

   @Query("""
        SELECT j FROM Job j
        WHERE j.isActive = true
        AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))
             OR LOWER(j.company) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))
             OR LOWER(j.description) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')))
        AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', CAST(:location AS string), '%')))
        AND (:jobType IS NULL OR j.jobType = :jobType)
        AND (:workMode IS NULL OR j.workMode = :workMode)
        AND (:experienceLevel IS NULL OR j.experienceLevel = :experienceLevel)
        AND (:industry IS NULL OR LOWER(j.industry) = LOWER(CAST(:industry AS string)))
        AND (:salaryMin IS NULL OR j.salaryMin >= :salaryMin)
        AND (:salaryMax IS NULL OR j.salaryMax <= :salaryMax)
        """)
    Page<Job> searchJobs(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("jobType") String jobType,
            @Param("workMode") String workMode,
            @Param("experienceLevel") String experienceLevel,
            @Param("industry") String industry,
            @Param("salaryMin") Double salaryMin,
            @Param("salaryMax") Double salaryMax,
            Pageable pageable
    );

    Page<Job> findByCreatedByIdAndIsActiveTrue(Long recruiterId, Pageable pageable);

    long countByCreatedByIdAndIsActiveTrue(Long recruiterId);
}
