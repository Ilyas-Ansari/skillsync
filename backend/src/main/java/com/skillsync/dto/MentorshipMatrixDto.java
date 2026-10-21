package com.skillsync.dto;

import java.util.ArrayList;
import java.util.List;

public class MentorshipMatrixDto {
    private List<UserDto> mentors = new ArrayList<>();
    private List<TeamDto> teams = new ArrayList<>();
    private List<MatrixCellDto> cells = new ArrayList<>();

    public MentorshipMatrixDto() {}

    public MentorshipMatrixDto(List<UserDto> mentors, List<TeamDto> teams, List<MatrixCellDto> cells) {
        this.mentors = mentors;
        this.teams = teams;
        this.cells = cells;
    }

    public List<UserDto> getMentors() {
        return mentors;
    }

    public void setMentors(List<UserDto> mentors) {
        this.mentors = mentors;
    }

    public List<TeamDto> getTeams() {
        return teams;
    }

    public void setTeams(List<TeamDto> teams) {
        this.teams = teams;
    }

    public List<MatrixCellDto> getCells() {
        return cells;
    }

    public void setCells(List<MatrixCellDto> cells) {
        this.cells = cells;
    }
}
