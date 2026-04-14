package com.nexhire.portal.repository;

import com.nexhire.portal.entity.SavedJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
    Optional<SavedJob> findByUserIdAndJobId(Long userId, Long jobId);
    Page<SavedJob> findByUserIdOrderBySavedAtDesc(Long userId, Pageable pageable);
    void deleteByUserIdAndJobId(Long userId, Long jobId);
}
