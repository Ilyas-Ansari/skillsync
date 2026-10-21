package com.skillsync.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class TeamDto {
    private Long id;
    private String name;
    private Long projectId;
    private String projectTitle;
    private String projectDomain;
    private String status;
    private LocalDateTime createdAt;
    private UserDto mentor;
    private List<UserDto> members = new ArrayList<>();
    private List<String> coveredSkills = new ArrayList<>();
    private List<String> missingSkills = new ArrayList<>();

    public TeamDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getProjectDomain() {
        return projectDomain;
    }

    public void setProjectDomain(String projectDomain) {
        this.projectDomain = projectDomain;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UserDto getMentor() {
        return mentor;
    }

    public void setMentor(UserDto mentor) {
        this.mentor = mentor;
    }

    public List<UserDto> getMembers() {
        return members;
    }

    public void setMembers(List<UserDto> members) {
        this.members = members;
    }

    public List<String> getCoveredSkills() {
        return coveredSkills;
    }

    public void setCoveredSkills(List<String> coveredSkills) {
        this.coveredSkills = coveredSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }
}
