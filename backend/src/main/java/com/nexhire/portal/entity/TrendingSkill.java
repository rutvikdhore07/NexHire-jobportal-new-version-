package com.nexhire.portal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity @Table(name = "trending_skills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TrendingSkill {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 100)
    private String category;     // Frontend, Backend, Cloud, AI/ML, DevOps …

    @Column(name = "job_count")
    @Builder.Default
    private Integer jobCount = 0;

    @Column(name = "growth_percent")
    private Double growthPercent;   // % growth in last 30 days

    @Column(name = "avg_salary")
    private Double avgSalary;

    @Column(name = "demand_level", length = 20)
    private String demandLevel;    // High, Medium, Low

    @Column(length = 200)
    private String description;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
