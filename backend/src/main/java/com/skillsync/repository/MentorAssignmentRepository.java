package com.skillsync.repository;

import com.skillsync.model.MentorAssignment;
import com.skillsync.model.Team;
import com.skillsync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorAssignmentRepository extends JpaRepository<MentorAssignment, Long> {
    List<MentorAssignment> findByTeam(Team team);
    List<MentorAssignment> findByMentor(User mentor);
    Optional<MentorAssignment> findByTeamAndMentor(Team team, User mentor);
    void deleteByTeam(Team team);
}
