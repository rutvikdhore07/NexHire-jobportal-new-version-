package com.nexhire.portal.config;

import com.nexhire.portal.entity.*;
import com.nexhire.portal.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds demo data on first startup if tables are empty.
 * Safe to run multiple times (checks before inserting).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final NewsArticleRepository newsRepo;
    private final TrendingSkillRepository skillRepo;
    private final CourseRepository courseRepo;

    @Override
    public void run(String... args) {
        seedNews();
        seedSkills();
        seedCourses();
    }

    private void seedNews() {
        if (newsRepo.count() > 0) return;
        List<NewsArticle> articles = List.of(
            build("Tech Giants Begin Massive Hiring Wave in 2025",
                "Major tech companies including Google, Microsoft and Amazon have announced plans to hire over 50,000 engineers in Q1 2025, reversing the layoff trend seen in 2023-24.",
                "https://techcrunch.com","TechCrunch","Hiring",true),
            build("AI Engineer Salaries Hit All-Time High",
                "Demand for AI/ML engineers has pushed average salaries past $180,000 in the US, with some senior roles exceeding $300,000 including stock compensation.",
                "https://wired.com","Wired","Salary",true),
            build("Remote Work Policies Shift: Hybrid Becomes the New Standard",
                "A new survey of 2,000 companies shows 68% have adopted hybrid work permanently, with full-remote dropping to 22% from its pandemic peak of 46%.",
                "https://forbes.com","Forbes","WorkTrends",false),
            build("India Emerges as Top Destination for Tech Talent",
                "India's tech workforce reached 5.8 million professionals in 2024, with Bangalore, Hyderabad and Pune being top hiring hubs for global MNCs.",
                "https://economictimes.com","Economic Times","GlobalJobs",true),
            build("Full-Stack Developers in Highest Demand for 2025",
                "Job postings for full-stack developers with React and Node.js skills grew 34% YoY. TypeScript proficiency is now required in 71% of frontend roles.",
                "https://stackoverflow.com","Stack Overflow","TechNews",false),
            build("Startup Funding Rebounds: 40% More Jobs Expected",
                "VC funding in Q4 2024 hit $85 billion globally, a 40% rebound from 2023 lows. This is expected to fuel significant hiring at Series A and B startups.",
                "https://venturebeat.com","VentureBeat","Startups",true),
            build("Cloud Certifications Now Worth 25% Salary Premium",
                "Professionals with AWS, GCP or Azure certifications command a 25% higher salary on average. AWS remains the most sought-after certification globally.",
                "https://cloudcomputing-news.net","Cloud News","Certifications",false),
            build("Cybersecurity Roles Have 3.5 Million Unfilled Positions Globally",
                "The cybersecurity talent gap has widened to 3.5 million unfilled roles worldwide. Organizations are offering aggressive compensation and remote-first policies to attract talent.",
                "https://cybersecurityventures.com","CS Ventures","Cybersecurity",true)
        );
        newsRepo.saveAll(articles);
        log.info("Seeded {} news articles", articles.size());
    }

    private NewsArticle build(String title, String summary, String url,
                               String source, String category, boolean featured) {
        return NewsArticle.builder()
                .title(title).summary(summary).url(url).source(source)
                .category(category).isFeatured(featured)
                .publishedAt(LocalDateTime.now().minusDays((long)(Math.random() * 14)))
                .build();
    }

    private void seedSkills() {
        if (skillRepo.count() > 0) return;
        List<TrendingSkill> skills = List.of(
            skill("React","Frontend",89000,42.5,1800000d,"High","The most popular JavaScript library for building user interfaces"),
            skill("Python","Backend",95000,38.2,2100000d,"High","Versatile language dominating data science, AI/ML, and backend development"),
            skill("TypeScript","Frontend",87000,55.1,1650000d,"High","Typed JavaScript that scales — now required in most modern frontend roles"),
            skill("AWS","Cloud",112000,29.3,1950000d,"High","Amazon Web Services — the leading cloud platform globally"),
            skill("Kubernetes","DevOps",118000,47.8,980000d,"High","Container orchestration platform essential for modern DevOps pipelines"),
            skill("Node.js","Backend",85000,22.4,1420000d,"High","JavaScript runtime for scalable backend services and APIs"),
            skill("Docker","DevOps",95000,31.7,1380000d,"High","Containerization tool used in virtually every modern deployment workflow"),
            skill("LLM / Prompt Engineering","AI/ML",130000,182.3,620000d,"High","Engineering prompts and workflows for large language models"),
            skill("Spring Boot","Backend",92000,18.6,870000d,"High","Java framework powering enterprise-grade REST APIs worldwide"),
            skill("PostgreSQL","Database",88000,24.1,940000d,"High","Advanced open-source relational database with JSON support"),
            skill("Flutter","Mobile",82000,38.9,530000d,"Medium","Google's cross-platform framework for iOS and Android apps"),
            skill("Rust","Systems",110000,67.2,340000d,"Medium","Systems programming language known for memory safety and performance"),
            skill("GraphQL","API",86000,19.8,410000d,"Medium","Query language for APIs providing flexible data fetching"),
            skill("Terraform","DevOps",105000,35.6,560000d,"High","Infrastructure as Code tool for cloud resource provisioning"),
            skill("Next.js","Frontend",88000,48.3,680000d,"High","React framework for production apps with SSR and static generation")
        );
        skillRepo.saveAll(skills);
        log.info("Seeded {} trending skills", skills.size());
    }

    private TrendingSkill skill(String name, String cat, int jobs,
                                 double growth, double salary, String demand, String desc) {
        return TrendingSkill.builder()
                .name(name).category(cat).jobCount(jobs)
                .growthPercent(growth).avgSalary(salary)
                .demandLevel(demand).description(desc).build();
    }

    private void seedCourses() {
        if (courseRepo.count() > 0) return;
        List<Course> courses = List.of(
            course("The Complete React Developer Course","Udemy","https://udemy.com","Frontend","Beginner","Paid",40,4.8,320000,"Master React 18, Hooks, Redux, Context API and build production apps","https://img-c.udemycdn.com/course/750x422/1286908_1639_3.jpg",true),
            course("CS50's Introduction to Computer Science","Harvard / edX","https://cs50.harvard.edu","Computer Science","Beginner","Free",100,4.9,4000000,"Harvard's legendary intro to CS — the best free course on the internet","https://i.imgur.com/E3bh1Wd.png",true),
            course("AWS Certified Solutions Architect","A Cloud Guru","https://acloudguru.com","Cloud","Intermediate","Paid",50,4.7,890000,"Pass the AWS SAA-C03 exam and become a certified cloud architect","https://i.imgur.com/QHRqhAB.png",true),
            course("Python for Everybody","University of Michigan","https://coursera.org","Backend","Beginner","Free",36,4.8,2800000,"The world's most popular Python course — 100% free to audit","https://i.imgur.com/3pULraX.png",false),
            course("Full-Stack Open","University of Helsinki","https://fullstackopen.com","Full Stack","Intermediate","Free",200,4.9,180000,"Deep dive into React, Node.js, GraphQL, TypeScript and testing","https://i.imgur.com/M3vc0cC.png",true),
            course("Machine Learning Specialization","deeplearning.ai / Coursera","https://coursera.org","AI/ML","Intermediate","Freemium",80,4.9,1200000,"Andrew Ng's updated ML course — the gold standard for ML education","https://i.imgur.com/9xFz5vw.png",true),
            course("Docker & Kubernetes: The Complete Guide","Udemy","https://udemy.com","DevOps","Intermediate","Paid",22,4.8,290000,"Build, test and deploy Docker + Kubernetes apps end-to-end","https://i.imgur.com/yvDCMiW.png",false),
            course("Spring Boot & Spring Framework 6","Udemy","https://udemy.com","Backend","Intermediate","Paid",45,4.7,210000,"Professional-grade Spring Boot 3, REST APIs, Security and JPA","https://i.imgur.com/LPxqS5P.png",false),
            course("System Design Interview","ByteByteGo","https://bytebytego.com","System Design","Advanced","Paid",30,4.9,95000,"Crack system design interviews at FAANG with real-world patterns","https://i.imgur.com/oWq8qf2.png",true),
            course("The Odin Project — Full Stack","The Odin Project","https://theodinproject.com","Full Stack","Beginner","Free",240,4.8,420000,"The most comprehensive free web development curriculum available","https://i.imgur.com/Ey7L2mB.png",true)
        );
        courseRepo.saveAll(courses);
        log.info("Seeded {} courses", courses.size());
    }

    private Course course(String title, String provider, String url, String category,
                           String level, String price, int hours, double rating,
                           int enrolled, String desc, String img, boolean featured) {
        return Course.builder()
                .title(title).provider(provider).url(url).category(category)
                .level(level).price(price).durationHours(hours).rating(rating)
                .enrolledCount(enrolled).description(desc).imageUrl(img)
                .isFeatured(featured).build();
    }
}
