package com.skillsync.dto;

import java.util.ArrayList;
import java.util.List;

public class MatrixCellDto {
    private Long mentorId;
    private String mentorName;
    private Long teamId;
    private String teamName;
    private String projectTitle;
    private Double score; // 0 to 100
    private Double gapCoverage; // 0 to 100
    private Double domainMatch; // 0 to 100
    private Boolean isAssigned;
    private List<String> coveredGaps = new ArrayList<>();

    public MatrixCellDto() {}

    public Long getMentorId() {
        return mentorId;
    }

    public void setMentorId(Long mentorId) {
        this.mentorId = mentorId;
    }

    public String getMentorName() {
        return mentorName;
    }

    public void setMentorName(String mentorName) {
        this.mentorName = mentorName;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Double getGapCoverage() {
        return gapCoverage;
    }

    public void setGapCoverage(Double gapCoverage) {
        this.gapCoverage = gapCoverage;
    }

    public Double getDomainMatch() {
        return domainMatch;
    }

    public void setDomainMatch(Double domainMatch) {
        this.domainMatch = domainMatch;
    }

    public Boolean getIsAssigned() {
        return isAssigned;
    }

    public void setIsAssigned(Boolean assigned) {
        isAssigned = assigned;
    }

    public List<String> getCoveredGaps() {
        return coveredGaps;
    }

    public void setCoveredGaps(List<String> coveredGaps) {
        this.coveredGaps = coveredGaps;
    }
}
