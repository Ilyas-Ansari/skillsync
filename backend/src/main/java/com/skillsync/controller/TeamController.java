package com.skillsync.controller;

import com.skillsync.dto.TeamDto;
import com.skillsync.service.MatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final MatchingService matchingService;

    public TeamController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping
    public ResponseEntity<List<TeamDto>> getAllTeams() {
        return ResponseEntity.ok(matchingService.getAllTeams());
    }

    @PostMapping("/generate")
    public ResponseEntity<List<TeamDto>> generateTeams() {
        return ResponseEntity.ok(matchingService.generateTeams());
    }

    @GetMapping("/my-team/{studentId}")
    public ResponseEntity<?> getMyTeam(@PathVariable Long studentId) {
        return matchingService.getStudentTeam(studentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}
