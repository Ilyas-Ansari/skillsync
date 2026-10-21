package com.skillsync.dto;

import java.util.ArrayList;
import java.util.List;

public class ProjectRecommendationDto {
    private ProjectDto project;
    private Double matchScore; // 0 to 100
    private Double skillFitScore; // 0 to 100
    private Double interestMatchScore; // 0 to 100
    private Double availabilityScore; // 0 to 100
    private List<SkillMatchDetail> skillBreakdown = new ArrayList<>();

    public ProjectRecommendationDto() {}

    public ProjectRecommendationDto(ProjectDto project, Double matchScore, Double skillFitScore, Double interestMatchScore, Double availabilityScore, List<SkillMatchDetail> skillBreakdown) {
        this.project = project;
        this.matchScore = matchScore;
        this.skillFitScore = skillFitScore;
        this.interestMatchScore = interestMatchScore;
        this.availabilityScore = availabilityScore;
        this.skillBreakdown = skillBreakdown;
    }

    public ProjectDto getProject() {
        return project;
    }

    public void setProject(ProjectDto project) {
        this.project = project;
    }

    public Double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Double matchScore) {
        this.matchScore = matchScore;
    }

    public Double getSkillFitScore() {
        return skillFitScore;
    }

    public void setSkillFitScore(Double skillFitScore) {
        this.skillFitScore = skillFitScore;
    }

    public Double getInterestMatchScore() {
        return interestMatchScore;
    }

    public void setInterestMatchScore(Double interestMatchScore) {
        this.interestMatchScore = interestMatchScore;
    }

    public Double getAvailabilityScore() {
        return availabilityScore;
    }

    public void setAvailabilityScore(Double availabilityScore) {
        this.availabilityScore = availabilityScore;
    }

    public List<SkillMatchDetail> getSkillBreakdown() {
        return skillBreakdown;
    }

    public void setSkillBreakdown(List<SkillMatchDetail> skillBreakdown) {
        this.skillBreakdown = skillBreakdown;
    }
}
