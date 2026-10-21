package com.skillsync.dto;

public class ProjectSkillDto {
    private Long skillId;
    private String skillName;
    private String category;
    private Integer requiredLevel;

    public ProjectSkillDto() {}

    public ProjectSkillDto(Long skillId, String skillName, String category, Integer requiredLevel) {
        this.skillId = skillId;
        this.skillName = skillName;
        this.category = category;
        this.requiredLevel = requiredLevel;
    }

    public Long getSkillId() {
        return skillId;
    }

    public void setSkillId(Long skillId) {
        this.skillId = skillId;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getRequiredLevel() {
        return requiredLevel;
    }

    public void setRequiredLevel(Integer requiredLevel) {
        this.requiredLevel = requiredLevel;
    }
}
