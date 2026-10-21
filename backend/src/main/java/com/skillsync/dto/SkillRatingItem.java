package com.skillsync.dto;

public class SkillRatingItem {
    private Long skillId;
    private Integer level; // 1 to 5

    public SkillRatingItem() {}

    public SkillRatingItem(Long skillId, Integer level) {
        this.skillId = skillId;
        this.level = level;
    }

    public Long getSkillId() {
        return skillId;
    }

    public void setSkillId(Long skillId) {
        this.skillId = skillId;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }
}
