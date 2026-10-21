package com.skillsync.repository;

import com.skillsync.model.Team;
import com.skillsync.model.TeamMember;
import com.skillsync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    List<TeamMember> findByTeam(Team team);
    List<TeamMember> findByTeamId(Long teamId);
    Optional<TeamMember> findByStudent(User student);
    Optional<TeamMember> findByStudentId(Long studentId);
    void deleteByTeam(Team team);
}
