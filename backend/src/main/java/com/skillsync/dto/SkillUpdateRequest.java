package com.skillsync.dto;

import java.util.ArrayList;
import java.util.List;

public class SkillUpdateRequest {
    private List<SkillRatingItem> skills = new ArrayList<>();

    public SkillUpdateRequest() {}

    public SkillUpdateRequest(List<SkillRatingItem> skills) {
        this.skills = skills;
    }

    public List<SkillRatingItem> getSkills() {
        return skills;
    }

    public void setSkills(List<SkillRatingItem> skills) {
        this.skills = skills;
    }
}
