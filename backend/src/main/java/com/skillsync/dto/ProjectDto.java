package com.skillsync.dto;

import java.util.ArrayList;
import java.util.List;

public class ProjectDto {
    private Long id;
    private String title;
    private String description;
    private String domain;
    private Integer teamSize;
    private Integer hoursNeeded;
    private String difficulty;
    private String status;
    private List<ProjectSkillDto> requiredSkills = new ArrayList<>();

    public ProjectDto() {}

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

    public List<ProjectSkillDto> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<ProjectSkillDto> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }
}
