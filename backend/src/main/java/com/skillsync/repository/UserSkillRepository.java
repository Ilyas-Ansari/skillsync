package com.skillsync.repository;

import com.skillsync.model.Skill;
import com.skillsync.model.User;
import com.skillsync.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUser(User user);
    List<UserSkill> findByUserId(Long userId);
    Optional<UserSkill> findByUserAndSkill(User user, Skill skill);
    void deleteByUser(User user);
}
