package com.skillsync.service;

import com.skillsync.dto.*;
import com.skillsync.model.*;
import com.skillsync.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;

    public UserService(UserRepository userRepository, SkillRepository skillRepository, UserSkillRepository userSkillRepository) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = "SKILLSYNC_" + UUID.randomUUID().toString();
        return new AuthResponse(token, toDto(user), "Login successful");
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered: " + email);
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(request.getPassword());
        user.setRole(request.getRole() != null ? request.getRole() : Role.STUDENT);
        user.setInterests(request.getInterests() != null ? request.getInterests() : "");
        user.setHoursPerWeek(request.getHoursPerWeek() != null ? request.getHoursPerWeek() : 15);
        user.setCapacity(request.getCapacity() != null ? request.getCapacity() : 2);
        user.setBio(request.getBio() != null ? request.getBio() : "");

        User savedUser = userRepository.save(user);
        String token = "SKILLSYNC_" + UUID.randomUUID().toString();
        return new AuthResponse(token, toDto(savedUser), "Registration successful");
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return toDto(user);
    }

    public List<UserDto> getUsersByRole(Role role) {
        return userRepository.findByRole(role).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getInterests() != null) {
            user.setInterests(request.getInterests());
        }
        if (request.getHoursPerWeek() != null) {
            user.setHoursPerWeek(request.getHoursPerWeek());
        }
        if (request.getCapacity() != null) {
            user.setCapacity(request.getCapacity());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        return toDto(userRepository.save(user));
    }

    public List<UserSkillDto> getUserSkills(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return userSkillRepository.findByUser(user).stream()
                .map(us -> new UserSkillDto(us.getSkill().getId(), us.getSkill().getName(), us.getSkill().getCategory(), us.getLevel()))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<UserSkillDto> updateUserSkills(Long userId, SkillUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        userSkillRepository.deleteByUser(user);
        userSkillRepository.flush();

        List<UserSkill> updatedList = new ArrayList<>();
        for (SkillRatingItem item : request.getSkills()) {
            if (item.getSkillId() == null || item.getLevel() == null || item.getLevel() < 1) continue;
            Optional<Skill> skillOpt = skillRepository.findById(item.getSkillId());
            if (skillOpt.isPresent()) {
                int level = Math.min(5, Math.max(1, item.getLevel()));
                updatedList.add(new UserSkill(user, skillOpt.get(), level));
            }
        }

        userSkillRepository.saveAll(updatedList);
        return getUserSkills(userId);
    }

    public UserDto toDto(User user) {
        UserDto dto = new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getInterests(),
                user.getHoursPerWeek(),
                user.getCapacity(),
                user.getBio()
        );

        List<UserSkill> skills = userSkillRepository.findByUser(user);
        dto.setSkills(skills.stream()
                .map(us -> new UserSkillDto(us.getSkill().getId(), us.getSkill().getName(), us.getSkill().getCategory(), us.getLevel()))
                .collect(Collectors.toList()));
        return dto;
    }
}
