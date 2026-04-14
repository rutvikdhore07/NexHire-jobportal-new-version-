package com.nexhire.portal.repository;

import com.nexhire.portal.entity.Application;
import com.nexhire.portal.entity.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByUserIdAndJobId(Long userId, Long jobId);

    Optional<Application> findByUserIdAndJobId(Long userId, Long jobId);

    Page<Application> findByUserIdOrderByAppliedAtDesc(Long userId, Pageable pageable);

    Page<Application> findByJobIdOrderByAppliedAtDesc(Long jobId, Pageable pageable);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, ApplicationStatus status);

    long countByJobId(Long jobId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.job.createdBy.id = :recruiterId")
    long countByRecruiterId(@Param("recruiterId") Long recruiterId);

    void deleteByJobId(Long jobId);
}
