package com.skillsync.dto;

public class UserSkillDto {
    private Long skillId;
    private String skillName;
    private String category;
    private Integer level;

    public UserSkillDto() {}

    public UserSkillDto(Long skillId, String skillName, String category, Integer level) {
        this.skillId = skillId;
        this.skillName = skillName;
        this.category = category;
        this.level = level;
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

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }
}
