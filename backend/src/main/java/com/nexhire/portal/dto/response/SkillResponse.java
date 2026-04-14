package com.nexhire.portal.dto.response;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class SkillResponse {
    private Long id;
    private String name, category, demandLevel, description;
    private Integer jobCount;
    private Double growthPercent, avgSalary;
}
