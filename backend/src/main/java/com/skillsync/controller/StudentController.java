package com.skillsync.controller;

import com.skillsync.dto.*;
import com.skillsync.model.Role;
import com.skillsync.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final UserService userService;

    public StudentController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllStudents() {
        return ResponseEntity.ok(userService.getUsersByRole(Role.STUDENT));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<UserDto> getStudentProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<UserDto> updateStudentProfile(@PathVariable Long id, @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateProfile(id, request));
    }

    @GetMapping("/{id}/skills")
    public ResponseEntity<List<UserSkillDto>> getStudentSkills(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserSkills(id));
    }

    @PutMapping("/{id}/skills")
    public ResponseEntity<List<UserSkillDto>> updateStudentSkills(@PathVariable Long id, @RequestBody SkillUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUserSkills(id, request));
    }
}
