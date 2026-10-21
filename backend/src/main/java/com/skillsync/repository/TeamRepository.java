package com.skillsync.repository;

import com.skillsync.model.Team;
import com.skillsync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findByMentor(User mentor);
    List<Team> findByMentorId(Long mentorId);
    Optional<Team> findByProjectId(Long projectId);
}
