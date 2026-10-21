package com.skillsync.controller;

import com.skillsync.dto.UserDto;
import com.skillsync.model.Role;
import com.skillsync.repository.*;
import com.skillsync.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final MentorAssignmentRepository mentorAssignmentRepository;
    private final UserService userService;

    public AdminController(UserRepository userRepository,
                           ProjectRepository projectRepository,
                           TeamRepository teamRepository,
                           TeamMemberRepository teamMemberRepository,
                           MentorAssignmentRepository mentorAssignmentRepository,
                           UserService userService) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.mentorAssignmentRepository = mentorAssignmentRepository;
        this.userService = userService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalStudents = userRepository.findByRole(Role.STUDENT).size();
        long totalMentors = userRepository.findByRole(Role.MENTOR).size();
        long totalProjects = projectRepository.count();
        long totalTeams = teamRepository.count();
        long matchedStudents = teamMemberRepository.count();

        stats.put("totalStudents", totalStudents);
        stats.put("totalMentors", totalMentors);
        stats.put("totalProjects", totalProjects);
        stats.put("totalTeams", totalTeams);
        stats.put("matchedStudents", matchedStudents);
        stats.put("unmatchedStudents", Math.max(0, totalStudents - matchedStudents));

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
