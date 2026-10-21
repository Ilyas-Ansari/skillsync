package com.skillsync.repository;

import com.skillsync.model.Project;
import com.skillsync.model.ProjectSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectSkillRepository extends JpaRepository<ProjectSkill, Long> {
    List<ProjectSkill> findByProject(Project project);
    List<ProjectSkill> findByProjectId(Long projectId);
    void deleteByProject(Project project);
}
