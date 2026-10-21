package com.skillsync.config;

import com.skillsync.model.*;
import com.skillsync.repository.*;
import com.skillsync.service.MatchingService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final ProjectRepository projectRepository;
    private final ProjectSkillRepository projectSkillRepository;
    private final MatchingService matchingService;

    public DataInitializer(UserRepository userRepository,
                           SkillRepository skillRepository,
                           UserSkillRepository userSkillRepository,
                           ProjectRepository projectRepository,
                           ProjectSkillRepository projectSkillRepository,
                           MatchingService matchingService) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
        this.projectRepository = projectRepository;
        this.projectSkillRepository = projectSkillRepository;
        this.matchingService = matchingService;
    }

    @Override
    public void run(String... args) {
        if (skillRepository.count() > 0) {
            return;
        }

        System.out.println(">>> Initializing SkillSync sample data for demo & viva...");

        // 1. Seed Skills
        Map<String, Skill> skills = new HashMap<>();
        addSkill(skills, "Java", "Backend");
        addSkill(skills, "Spring Boot", "Backend");
        addSkill(skills, "React", "Frontend");
        addSkill(skills, "TypeScript", "Frontend");
        addSkill(skills, "Python", "Data & AI");
        addSkill(skills, "Machine Learning", "Data & AI");
        addSkill(skills, "PostgreSQL", "Database");
        addSkill(skills, "Docker", "DevOps & Cloud");
        addSkill(skills, "AWS", "DevOps & Cloud");
        addSkill(skills, "UI/UX Design", "Design");
        addSkill(skills, "Node.js", "Backend");

        // 2. Seed Admin User
        User admin = new User(
                null,
                "Academic Coordinator",
                "admin@skillsync.edu",
                "admin123",
                Role.ADMIN,
                "Program Management, Curriculum, Team Mentorship",
                40,
                10,
                "Lead Academic Coordinator overseeing student capstone and micro projects."
        );
        userRepository.save(admin);

        // 3. Seed Mentors
        User mentor1 = createUser("Dr. Sarah Chen", "sarah.chen@skillsync.edu", "mentor123", Role.MENTOR,
                "Cloud & DevOps, Enterprise Java", 20, 2,
                "Associate Professor with 12+ years in Cloud Architecture and Enterprise Microservices.");
        User mentor2 = createUser("Alex Rivera", "alex.rivera@skillsync.edu", "mentor123", Role.MENTOR,
                "Full Stack Web, Frontend, UI/UX", 20, 2,
                "Senior Staff Engineer specializing in modern frontend ecosystems and reactive architectures.");
        User mentor3 = createUser("Prof. David Kumar", "david.kumar@skillsync.edu", "mentor123", Role.MENTOR,
                "AI / Machine Learning, Data Science", 20, 2,
                "AI Researcher focusing on predictive modeling, NLP, and intelligent recommendation systems.");
        User mentor4 = createUser("Priya Sharma", "priya.sharma@skillsync.edu", "mentor123", Role.MENTOR,
                "Enterprise Java, Backend, Database", 20, 2,
                "Principal Architect with deep expertise in Spring Boot, distributed databases, and high-throughput systems.");

        // Mentor Skills
        addMentorSkill(mentor1, skills.get("Java"), 5);
        addMentorSkill(mentor1, skills.get("Spring Boot"), 5);
        addMentorSkill(mentor1, skills.get("Docker"), 5);
        addMentorSkill(mentor1, skills.get("AWS"), 5);

        addMentorSkill(mentor2, skills.get("React"), 5);
        addMentorSkill(mentor2, skills.get("TypeScript"), 5);
        addMentorSkill(mentor2, skills.get("UI/UX Design"), 4);
        addMentorSkill(mentor2, skills.get("Node.js"), 5);

        addMentorSkill(mentor3, skills.get("Python"), 5);
        addMentorSkill(mentor3, skills.get("Machine Learning"), 5);
        addMentorSkill(mentor3, skills.get("PostgreSQL"), 4);

        addMentorSkill(mentor4, skills.get("Java"), 5);
        addMentorSkill(mentor4, skills.get("Spring Boot"), 5);
        addMentorSkill(mentor4, skills.get("PostgreSQL"), 5);
        addMentorSkill(mentor4, skills.get("Docker"), 4);

        // 4. Seed Students
        User s1 = createUser("Rahul Verma", "rahul@student.edu", "student123", Role.STUDENT,
                "Enterprise Java, Cloud & DevOps", 20, 0, "Passionate about backend services and microservice architecture.");
        addStudentSkill(s1, skills.get("Java"), 4);
        addStudentSkill(s1, skills.get("Spring Boot"), 3);
        addStudentSkill(s1, skills.get("PostgreSQL"), 3);
        addStudentSkill(s1, skills.get("React"), 2);

        User s2 = createUser("Ananya Patel", "ananya@student.edu", "student123", Role.STUDENT,
                "Full Stack Web, Frontend, UI/UX", 16, 0, "Frontend developer eager to craft pixel-perfect user experiences.");
        addStudentSkill(s2, skills.get("React"), 5);
        addStudentSkill(s2, skills.get("TypeScript"), 4);
        addStudentSkill(s2, skills.get("UI/UX Design"), 4);

        User s3 = createUser("Carlos Gomez", "carlos@student.edu", "student123", Role.STUDENT,
                "AI / Machine Learning, Data Science", 18, 0, "Focused on deep learning models and data pipelining.");
        addStudentSkill(s3, skills.get("Python"), 4);
        addStudentSkill(s3, skills.get("Machine Learning"), 4);
        addStudentSkill(s3, skills.get("PostgreSQL"), 3);

        User s4 = createUser("Emily Watson", "emily@student.edu", "student123", Role.STUDENT,
                "Cloud & DevOps, Enterprise Java", 15, 0, "DevOps and containerization enthusiast.");
        addStudentSkill(s4, skills.get("Docker"), 4);
        addStudentSkill(s4, skills.get("AWS"), 3);
        addStudentSkill(s4, skills.get("Java"), 3);

        User s5 = createUser("Vikram Singh", "vikram@student.edu", "student123", Role.STUDENT,
                "Full Stack Web, Enterprise Java", 20, 0, "Full stack engineer building scalable web applications.");
        addStudentSkill(s5, skills.get("React"), 4);
        addStudentSkill(s5, skills.get("Node.js"), 4);
        addStudentSkill(s5, skills.get("TypeScript"), 3);

        User s6 = createUser("Sneha Reddy", "sneha@student.edu", "student123", Role.STUDENT,
                "Enterprise Java, Cloud & DevOps", 18, 0, "Spring Boot enthusiast building resilient APIs.");
        addStudentSkill(s6, skills.get("Java"), 3);
        addStudentSkill(s6, skills.get("Spring Boot"), 4);
        addStudentSkill(s6, skills.get("Docker"), 3);

        User s7 = createUser("Liam O'Connor", "liam@student.edu", "student123", Role.STUDENT,
                "AI / Machine Learning, Full Stack Web", 16, 0, "Exploring data-driven web applications.");
        addStudentSkill(s7, skills.get("Python"), 4);
        addStudentSkill(s7, skills.get("React"), 3);
        addStudentSkill(s7, skills.get("PostgreSQL"), 4);

        User s8 = createUser("Mei Lin", "mei@student.edu", "student123", Role.STUDENT,
                "Full Stack Web, UI/UX Design", 18, 0, "Design technologist bridging Figma and React code.");
        addStudentSkill(s8, skills.get("UI/UX Design"), 5);
        addStudentSkill(s8, skills.get("React"), 4);
        addStudentSkill(s8, skills.get("TypeScript"), 3);

        User s9 = createUser("Rohan Gupta", "rohan@student.edu", "student123", Role.STUDENT,
                "Cloud & DevOps, Enterprise Java", 20, 0, "Infrastructure automator and cloud builder.");
        addStudentSkill(s9, skills.get("AWS"), 4);
        addStudentSkill(s9, skills.get("Docker"), 4);
        addStudentSkill(s9, skills.get("Java"), 3);

        User s10 = createUser("Sophia Martinez", "sophia@student.edu", "student123", Role.STUDENT,
                "AI / Machine Learning, Cloud & DevOps", 15, 0, "Machine learning engineer exploring cloud deployment.");
        addStudentSkill(s10, skills.get("Machine Learning"), 4);
        addStudentSkill(s10, skills.get("Python"), 5);
        addStudentSkill(s10, skills.get("AWS"), 3);

        // 5. Seed Projects
        Project p1 = createProject("Smart Campus Cloud Portal",
                "A scalable cloud-native microservice portal providing automated facility booking, event notifications, and IoT room occupancy metrics.",
                "Cloud & DevOps", 3, 15, "Intermediate");
        addProjectSkill(p1, skills.get("Java"), 3);
        addProjectSkill(p1, skills.get("Spring Boot"), 3);
        addProjectSkill(p1, skills.get("Docker"), 3);
        addProjectSkill(p1, skills.get("AWS"), 3);

        Project p2 = createProject("FinTech AI Fraud Detection Engine",
                "Real-time transaction streaming pipeline that evaluates fraud risk using statistical scoring and machine learning models.",
                "AI / Machine Learning", 3, 18, "Advanced");
        addProjectSkill(p2, skills.get("Python"), 4);
        addProjectSkill(p2, skills.get("Machine Learning"), 4);
        addProjectSkill(p2, skills.get("PostgreSQL"), 3);

        Project p3 = createProject("Healthcare Patient Dashboard",
                "Interactive React medical portal enabling patients to view longitudinal health trends, schedule virtual visits, and inspect lab analytics.",
                "Full Stack Web", 3, 15, "Intermediate");
        addProjectSkill(p3, skills.get("React"), 4);
        addProjectSkill(p3, skills.get("TypeScript"), 3);
        addProjectSkill(p3, skills.get("UI/UX Design"), 3);
        addProjectSkill(p3, skills.get("Node.js"), 3);

        Project p4 = createProject("Microservices E-Commerce Backplane",
                "High-concurrency order placement and catalog management service with PostgreSQL persistence and Dockerized deployment.",
                "Enterprise Java", 3, 18, "Intermediate");
        addProjectSkill(p4, skills.get("Java"), 4);
        addProjectSkill(p4, skills.get("Spring Boot"), 4);
        addProjectSkill(p4, skills.get("PostgreSQL"), 3);
        addProjectSkill(p4, skills.get("Docker"), 3);

        // Run initial team matching so the dashboard and matrix have rich initial data ready
        try {
            matchingService.generateTeams();
            System.out.println(">>> Sample teams and mentorship matrix generated successfully!");
        } catch (Exception e) {
            System.out.println(">>> Initial team generation notice: " + e.getMessage());
        }

        System.out.println(">>> SkillSync data initialization complete!");
    }

    private void addSkill(Map<String, Skill> map, String name, String category) {
        Skill skill = skillRepository.save(new Skill(name, category));
        map.put(name, skill);
    }

    private User createUser(String name, String email, String password, Role role, String interests, int hours, int cap, String bio) {
        User u = new User(null, name, email, password, role, interests, hours, cap, bio);
        return userRepository.save(u);
    }

    private void addStudentSkill(User student, Skill skill, int level) {
        userSkillRepository.save(new UserSkill(student, skill, level));
    }

    private void addMentorSkill(User mentor, Skill skill, int level) {
        userSkillRepository.save(new UserSkill(mentor, skill, level));
    }

    private Project createProject(String title, String desc, String domain, int teamSize, int hours, String diff) {
        Project p = new Project(title, desc, domain, teamSize, hours, diff, "OPEN");
        return projectRepository.save(p);
    }

    private void addProjectSkill(Project p, Skill skill, int reqLevel) {
        projectSkillRepository.save(new ProjectSkill(p, skill, reqLevel));
    }
}
