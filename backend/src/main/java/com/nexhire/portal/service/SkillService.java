package com.nexhire.portal.service;

import com.nexhire.portal.dto.response.SkillResponse;
import com.nexhire.portal.entity.TrendingSkill;
import com.nexhire.portal.repository.TrendingSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;


@Service @RequiredArgsConstructor
public class SkillService {
    private final TrendingSkillRepository repo;

    @Transactional(readOnly = true)
    public List<SkillResponse> getAll(String category) {
        List<TrendingSkill> skills = category != null && !category.isBlank()
                ? repo.findByCategoryOrderByJobCountDesc(category)
                : repo.findAllByOrderByJobCountDesc();
        return skills.stream().map(this::map).toList();
    }

    @Transactional(readOnly = true)
    public List<SkillResponse> getHotSkills() {
        return repo.findByDemandLevelOrderByJobCountDesc("High")
                .stream().limit(12).map(this::map).toList();
    }

    private SkillResponse map(TrendingSkill s) {
        return SkillResponse.builder()
                .id(s.getId()).name(s.getName()).category(s.getCategory())
                .demandLevel(s.getDemandLevel()).description(s.getDescription())
                .jobCount(s.getJobCount()).growthPercent(s.getGrowthPercent())
                .avgSalary(s.getAvgSalary()).build();
    }
}
