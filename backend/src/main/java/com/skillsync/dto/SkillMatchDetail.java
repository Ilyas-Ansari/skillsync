package com.skillsync.dto;

public class SkillMatchDetail {
    private String skillName;
    private Integer studentLevel;
    private Integer requiredLevel;
    private Double matchPercentage;

    public SkillMatchDetail() {}

    public SkillMatchDetail(String skillName, Integer studentLevel, Integer requiredLevel, Double matchPercentage) {
        this.skillName = skillName;
        this.studentLevel = studentLevel;
        this.requiredLevel = requiredLevel;
        this.matchPercentage = matchPercentage;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public Integer getStudentLevel() {
        return studentLevel;
    }

    public void setStudentLevel(Integer studentLevel) {
        this.studentLevel = studentLevel;
    }

    public Integer getRequiredLevel() {
        return requiredLevel;
    }

    public void setRequiredLevel(Integer requiredLevel) {
        this.requiredLevel = requiredLevel;
    }

    public Double getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(Double matchPercentage) {
        this.matchPercentage = matchPercentage;
    }
}
