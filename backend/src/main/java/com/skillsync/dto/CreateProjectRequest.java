package com.skillsync.dto;

import java.util.ArrayList;
import java.util.List;

public class CreateProjectRequest {
    private String title;
    private String description;
    private String domain;
    private Integer teamSize = 3;
    private Integer hoursNeeded = 15;
    private String difficulty = "Intermediate";
    private List<SkillRatingItem> requiredSkills = new ArrayList<>();

    public CreateProjectRequest() {}

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

    public List<SkillRatingItem> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<SkillRatingItem> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }
}
