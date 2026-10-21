package com.skillsync.controller;

import com.skillsync.dto.*;
import com.skillsync.service.MatchingService;
import com.skillsync.service.ProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final MatchingService matchingService;

    public ProjectController(ProjectService projectService, MatchingService matchingService) {
        this.projectService = projectService;
        this.matchingService = matchingService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody CreateProjectRequest request) {
        return ResponseEntity.ok(projectService.createProject(request));
    }

    @GetMapping("/recommended/{studentId}")
    public ResponseEntity<List<ProjectRecommendationDto>> getRecommendedProjects(@PathVariable Long studentId) {
        return ResponseEntity.ok(matchingService.getRecommendedProjects(studentId));
    }
}
