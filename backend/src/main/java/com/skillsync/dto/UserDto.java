package com.skillsync.dto;

import com.skillsync.model.Role;
import java.util.ArrayList;
import java.util.List;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String interests;
    private Integer hoursPerWeek;
    private Integer capacity;
    private String bio;
    private List<UserSkillDto> skills = new ArrayList<>();

    public UserDto() {}

    public UserDto(Long id, String name, String email, Role role, String interests, Integer hoursPerWeek, Integer capacity, String bio) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.interests = interests;
        this.hoursPerWeek = hoursPerWeek;
        this.capacity = capacity;
        this.bio = bio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public Integer getHoursPerWeek() {
        return hoursPerWeek;
    }

    public void setHoursPerWeek(Integer hoursPerWeek) {
        this.hoursPerWeek = hoursPerWeek;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public List<UserSkillDto> getSkills() {
        return skills;
    }

    public void setSkills(List<UserSkillDto> skills) {
        this.skills = skills;
    }
}
