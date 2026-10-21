package com.skillsync.controller;

import com.skillsync.dto.MentorshipMatrixDto;
import com.skillsync.dto.TeamDto;
import com.skillsync.dto.UserDto;
import com.skillsync.model.Role;
import com.skillsync.service.MentorshipService;
import com.skillsync.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentors")
public class MentorController {

    private final UserService userService;
    private final MentorshipService mentorshipService;

    public MentorController(UserService userService, MentorshipService mentorshipService) {
        this.userService = userService;
        this.mentorshipService = mentorshipService;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllMentors() {
        return ResponseEntity.ok(userService.getUsersByRole(Role.MENTOR));
    }

    @GetMapping("/matrix")
    public ResponseEntity<MentorshipMatrixDto> getMentorshipMatrix() {
        return ResponseEntity.ok(mentorshipService.getMentorshipMatrix());
    }

    @GetMapping("/{id}/teams")
    public ResponseEntity<List<TeamDto>> getMentorTeams(@PathVariable Long id) {
        return ResponseEntity.ok(mentorshipService.getAssignedTeamsForMentor(id));
    }
}
