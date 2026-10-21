package com.skillsync.service;

import com.skillsync.dto.*;
import com.skillsync.model.*;
import com.skillsync.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ProjectSkillRepository projectSkillRepository;

    public ProjectService(ProjectRepository projectRepository, SkillRepository skillRepository, ProjectSkillRepository projectSkillRepository) {
        this.projectRepository = projectRepository;
        this.skillRepository = skillRepository;
        this.projectSkillRepository = projectSkillRepository;
    }

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        return toDto(project);
    }

    @Transactional
    public ProjectDto createProject(CreateProjectRequest request) {
        Project project = new Project();
        project.setTitle(request.getTitle().trim());
        project.setDescription(request.getDescription());
        project.setDomain(request.getDomain());
        project.setTeamSize(request.getTeamSize() != null ? request.getTeamSize() : 3);
        project.setHoursNeeded(request.getHoursNeeded() != null ? request.getHoursNeeded() : 15);
        project.setDifficulty(request.getDifficulty() != null ? request.getDifficulty() : "Intermediate");
        project.setStatus("OPEN");

        Project savedProject = projectRepository.save(project);

        if (request.getRequiredSkills() != null) {
            for (SkillRatingItem item : request.getRequiredSkills()) {
                if (item.getSkillId() == null || item.getLevel() == null) continue;
                Optional<Skill> skillOpt = skillRepository.findById(item.getSkillId());
                if (skillOpt.isPresent()) {
                    int reqLevel = Math.min(5, Math.max(1, item.getLevel()));
                    projectSkillRepository.save(new ProjectSkill(savedProject, skillOpt.get(), reqLevel));
                }
            }
        }

        return toDto(projectRepository.findById(savedProject.getId()).orElse(savedProject));
    }

    @Transactional
    public ProjectDto updateProjectStatus(Long id, String status) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        project.setStatus(status);
        return toDto(projectRepository.save(project));
    }

    public ProjectDto toDto(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setDomain(project.getDomain());
        dto.setTeamSize(project.getTeamSize());
        dto.setHoursNeeded(project.getHoursNeeded());
        dto.setDifficulty(project.getDifficulty());
        dto.setStatus(project.getStatus());

        List<ProjectSkill> skills = projectSkillRepository.findByProject(project);
        dto.setRequiredSkills(skills.stream()
                .map(ps -> new ProjectSkillDto(
                        ps.getSkill().getId(),
                        ps.getSkill().getName(),
                        ps.getSkill().getCategory(),
                        ps.getRequiredLevel()))
                .collect(Collectors.toList()));

        return dto;
    }
}
