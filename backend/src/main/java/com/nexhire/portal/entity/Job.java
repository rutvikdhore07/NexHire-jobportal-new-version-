package com.nexhire.portal.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "jobs", indexes = {
        @Index(name = "idx_job_title", columnList = "title"),
        @Index(name = "idx_job_location", columnList = "location"),
        @Index(name = "idx_job_company", columnList = "company"),
        @Index(name = "idx_job_created_by", columnList = "created_by")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 200)
    private String company;

    @Column(nullable = false, length = 200)
    private String location;

    @Column(name = "salary_min")
    private Double salaryMin;

    @Column(name = "salary_max")
    private Double salaryMax;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "skills_required", length = 500)
    private String skillsRequired;

    @Column(name = "job_type", length = 50)
    private String jobType;          // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP

    @Column(name = "experience_level", length = 50)
    private String experienceLevel;  // ENTRY, MID, SENIOR, LEAD

    @Column(name = "work_mode", length = 50)
    private String workMode;         // REMOTE, HYBRID, ON_SITE

    @Column(length = 100)
    private String industry;

    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    @Column(name = "openings")
    @Builder.Default
    private Integer openings = 1;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Application> applications;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SavedJob> savedByUsers;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
