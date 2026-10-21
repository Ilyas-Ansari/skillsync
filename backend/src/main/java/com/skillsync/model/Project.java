package com.skillsync.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String domain; // e.g. "Full Stack Web", "AI / Machine Learning", "Cloud & DevOps"

    @Column(nullable = false)
    private Integer teamSize = 3;

    @Column(nullable = false)
    private Integer hoursNeeded = 15;

    @Column(nullable = false)
    private String difficulty = "Intermediate"; // "Beginner", "Intermediate", "Advanced"

    @Column(nullable = false)
    private String status = "OPEN"; // "OPEN", "MATCHED", "IN_PROGRESS", "COMPLETED"

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ProjectSkill> requiredSkills = new ArrayList<>();

    public Project() {
    }

    public Project(String title, String description, String domain, Integer teamSize, Integer hoursNeeded, String difficulty, String status) {
        this.title = title;
        this.description = description;
        this.domain = domain;
        this.teamSize = teamSize != null ? teamSize : 3;
        this.hoursNeeded = hoursNeeded != null ? hoursNeeded : 15;
        this.difficulty = difficulty != null ? difficulty : "Intermediate";
        this.status = status != null ? status : "OPEN";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public Integer getTeamSize() {
        return teamSize;
    }

    public void setTeamSize(Integer teamSize) {
        this.teamSize = teamSize;
    }

    public Integer getHoursNeeded() {
        return hoursNeeded;
    }

    public void setHoursNeeded(Integer hoursNeeded) {
        this.hoursNeeded = hoursNeeded;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<ProjectSkill> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<ProjectSkill> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public void addRequiredSkill(Skill skill, int requiredLevel) {
        ProjectSkill ps = new ProjectSkill(this, skill, requiredLevel);
        this.requiredSkills.add(ps);
    }
}
