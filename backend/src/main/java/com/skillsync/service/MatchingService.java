package com.skillsync.service;

import com.skillsync.dto.*;
import com.skillsync.model.*;
import com.skillsync.repository.*;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final UserSkillRepository userSkillRepository;
    private final ProjectSkillRepository projectSkillRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final ProjectService projectService;
    private final UserService userService;
    private final MentorshipService mentorshipService;

    public MatchingService(UserRepository userRepository,
                           ProjectRepository projectRepository,
                           UserSkillRepository userSkillRepository,
                           ProjectSkillRepository projectSkillRepository,
                           TeamRepository teamRepository,
                           TeamMemberRepository teamMemberRepository,
                           ProjectService projectService,
                           UserService userService,
                           @Lazy MentorshipService mentorshipService) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.userSkillRepository = userSkillRepository;
        this.projectSkillRepository = projectSkillRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.projectService = projectService;
        this.userService = userService;
        this.mentorshipService = mentorshipService;
    }

    /**
     * Calculates the match recommendation for a student across all projects,
     * sorted descending by overall match percentage.
     */
    public List<ProjectRecommendationDto> getRecommendedProjects(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        List<Project> allProjects = projectRepository.findAll();
        List<ProjectRecommendationDto> recommendations = new ArrayList<>();

        for (Project project : allProjects) {
            recommendations.add(calculateRecommendation(student, project));
        }

        recommendations.sort((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()));
        return recommendations;
    }

    /**
     * Plain Java Weighted Scoring Formula:
     * skillFit = average of min(studentLevel, requiredLevel) / requiredLevel
     * interestMatch = 1.0 (if domain matched) or 0.2
     * availability = min(studentHours, projectHours) / projectHours
     * score = 0.6 * skillFit + 0.2 * interestMatch + 0.2 * availability
     */
    public ProjectRecommendationDto calculateRecommendation(User student, Project project) {
        List<UserSkill> studentSkills = userSkillRepository.findByUser(student);
        Map<Long, Integer> studentSkillMap = studentSkills.stream()
                .collect(Collectors.toMap(us -> us.getSkill().getId(), UserSkill::getLevel, (l1, l2) -> l1));

        List<ProjectSkill> requiredSkills = projectSkillRepository.findByProject(project);

        double totalSkillFit = 0.0;
        List<SkillMatchDetail> details = new ArrayList<>();

        if (requiredSkills.isEmpty()) {
            totalSkillFit = 1.0;
        } else {
            for (ProjectSkill ps : requiredSkills) {
                Long skillId = ps.getSkill().getId();
                int requiredLevel = Math.max(1, ps.getRequiredLevel());
                int studentLevel = studentSkillMap.getOrDefault(skillId, 0);

                double ratio = (double) Math.min(studentLevel, requiredLevel) / (double) requiredLevel;
                totalSkillFit += ratio;

                details.add(new SkillMatchDetail(
                        ps.getSkill().getName(),
                        studentLevel,
                        requiredLevel,
                        Math.round(ratio * 1000.0) / 10.0
                ));
            }
            totalSkillFit /= requiredSkills.size();
        }

        // Domain interest match
        double interestMatch = 0.2;
        if (student.getInterests() != null && !student.getInterests().trim().isEmpty() && project.getDomain() != null) {
            String studentInterestsLower = student.getInterests().toLowerCase();
            String domainLower = project.getDomain().toLowerCase();

            if (studentInterestsLower.contains(domainLower) || domainLower.contains(studentInterestsLower)) {
                interestMatch = 1.0;
            } else {
                // Check token by token
                String[] tokens = studentInterestsLower.split("[,;\\s]+");
                for (String token : tokens) {
                    if (token.length() > 2 && domainLower.contains(token)) {
                        interestMatch = 0.8;
                        break;
                    }
                }
            }
        }

        // Availability match
        int studentHours = student.getHoursPerWeek() != null ? student.getHoursPerWeek() : 15;
        int requiredHours = project.getHoursNeeded() != null && project.getHoursNeeded() > 0 ? project.getHoursNeeded() : 15;
        double availability = Math.min(1.0, (double) studentHours / (double) requiredHours);

        // Weighted overall score: 60% skills + 20% interest + 20% availability
        double rawScore = (0.6 * totalSkillFit) + (0.2 * interestMatch) + (0.2 * availability);
        double finalPercentage = Math.round(rawScore * 1000.0) / 10.0;
        double skillFitPercentage = Math.round(totalSkillFit * 1000.0) / 10.0;
        double interestPercentage = Math.round(interestMatch * 1000.0) / 10.0;
        double availabilityPercentage = Math.round(availability * 1000.0) / 10.0;

        return new ProjectRecommendationDto(
                projectService.toDto(project),
                finalPercentage,
                skillFitPercentage,
                interestPercentage,
                availabilityPercentage,
                details
        );
    }

    /**
     * Greedy Team Generation Algorithm:
     * 1. Collects unassigned students and open projects.
     * 2. For each project, ranks available students by match score.
     * 3. Selects top N students for each team to ensure maximum fit.
     * 4. Forms teams and invokes mentorship matching.
     */
    @Transactional
    public List<TeamDto> generateTeams() {
        // Reset previous teams
        mentorshipService.clearAllAssignments();
        teamMemberRepository.deleteAll();
        teamRepository.deleteAll();

        List<Project> projects = projectRepository.findAll();
        for (Project p : projects) {
            p.setStatus("OPEN");
        }
        projectRepository.saveAll(projects);

        List<User> students = userRepository.findByRole(Role.STUDENT);
        Set<Long> assignedStudentIds = new HashSet<>();
        List<Team> createdTeams = new ArrayList<>();

        char teamCode = 'A';
        for (Project project : projects) {
            // Find all unassigned students
            List<User> availableStudents = students.stream()
                    .filter(s -> !assignedStudentIds.contains(s.getId()))
                    .collect(Collectors.toList());

            if (availableStudents.isEmpty()) {
                break;
            }

            // Score each candidate student for this project
            List<StudentScorePair> scoredCandidates = new ArrayList<>();
            for (User s : availableStudents) {
                ProjectRecommendationDto rec = calculateRecommendation(s, project);
                scoredCandidates.add(new StudentScorePair(s, rec.getMatchScore()));
            }

            // Sort descending by score
            scoredCandidates.sort((a, b) -> Double.compare(b.score, a.score));

            // Pick up to project.getTeamSize() students
            int targetSize = project.getTeamSize() != null ? project.getTeamSize() : 3;
            List<User> selectedStudents = scoredCandidates.stream()
                    .limit(targetSize)
                    .map(pair -> pair.student)
                    .collect(Collectors.toList());

            if (!selectedStudents.isEmpty()) {
                Team team = new Team("Team " + teamCode + " - " + project.getTitle(), project);
                Team savedTeam = teamRepository.save(team);

                for (User st : selectedStudents) {
                    teamMemberRepository.save(new TeamMember(savedTeam, st));
                    assignedStudentIds.add(st.getId());
                }

                project.setStatus("MATCHED");
                projectRepository.save(project);
                createdTeams.add(savedTeam);
                teamCode++;
            }
        }

        // Run Mentorship Matching on newly created teams
        mentorshipService.assignMentorsToTeams(createdTeams);

        return teamRepository.findAll().stream()
                .map(this::toTeamDto)
                .collect(Collectors.toList());
    }

    public List<TeamDto> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(this::toTeamDto)
                .collect(Collectors.toList());
    }

    public Optional<TeamDto> getStudentTeam(Long studentId) {
        return teamMemberRepository.findByStudentId(studentId)
                .map(tm -> toTeamDto(tm.getTeam()));
    }

    public TeamDto toTeamDto(Team team) {
        TeamDto dto = new TeamDto();
        dto.setId(team.getId());
        dto.setName(team.getName());
        dto.setProjectId(team.getProject().getId());
        dto.setProjectTitle(team.getProject().getTitle());
        dto.setProjectDomain(team.getProject().getDomain());
        dto.setStatus(team.getStatus());
        dto.setCreatedAt(team.getCreatedAt());

        if (team.getMentor() != null) {
            dto.setMentor(userService.toDto(team.getMentor()));
        }

        List<TeamMember> members = teamMemberRepository.findByTeam(team);
        dto.setMembers(members.stream()
                .map(m -> userService.toDto(m.getStudent()))
                .collect(Collectors.toList()));

        // Calculate covered vs missing skills in team
        List<ProjectSkill> requiredSkills = projectSkillRepository.findByProject(team.getProject());
        List<String> covered = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (ProjectSkill ps : requiredSkills) {
            String skillName = ps.getSkill().getName();
            int reqLevel = ps.getRequiredLevel();
            boolean meetsLevel = false;

            for (TeamMember tm : members) {
                List<UserSkill> studentSkills = userSkillRepository.findByUser(tm.getStudent());
                for (UserSkill us : studentSkills) {
                    if (us.getSkill().getId().equals(ps.getSkill().getId()) && us.getLevel() >= reqLevel) {
                        meetsLevel = true;
                        break;
                    }
                }
                if (meetsLevel) break;
            }

            if (meetsLevel) {
                covered.add(skillName + " (Lvl " + reqLevel + "+)");
            } else {
                missing.add(skillName + " (Need Lvl " + reqLevel + ")");
            }
        }

        dto.setCoveredSkills(covered);
        dto.setMissingSkills(missing);
        return dto;
    }

    private static class StudentScorePair {
        final User student;
        final double score;

        StudentScorePair(User student, double score) {
            this.student = student;
            this.score = score;
        }
    }
}
