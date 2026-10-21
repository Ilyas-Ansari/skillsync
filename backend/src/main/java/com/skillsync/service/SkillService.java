package com.skillsync.service;

import com.skillsync.dto.SkillDto;
import com.skillsync.model.Skill;
import com.skillsync.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<SkillDto> getAllSkills() {
        return skillRepository.findAll().stream()
                .map(s -> new SkillDto(s.getId(), s.getName(), s.getCategory()))
                .collect(Collectors.toList());
    }

    public SkillDto createSkill(String name, String category) {
        Skill skill = skillRepository.findByNameIgnoreCase(name.trim())
                .orElseGet(() -> skillRepository.save(new Skill(name.trim(), category.trim())));
        return new SkillDto(skill.getId(), skill.getName(), skill.getCategory());
    }
}
