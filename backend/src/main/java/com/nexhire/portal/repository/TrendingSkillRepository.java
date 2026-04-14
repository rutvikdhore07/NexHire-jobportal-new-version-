package com.nexhire.portal.repository;

import com.nexhire.portal.entity.TrendingSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrendingSkillRepository extends JpaRepository<TrendingSkill, Long> {
    List<TrendingSkill> findAllByOrderByJobCountDesc();
    List<TrendingSkill> findByCategoryOrderByJobCountDesc(String category);
    List<TrendingSkill> findByDemandLevelOrderByJobCountDesc(String demandLevel);
}
