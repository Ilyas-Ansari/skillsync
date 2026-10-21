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
public class MentorshipService {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final ProjectSkillRepository projectSkillRepository;
    private final UserSkillRepository userSkillRepository;
    private final MentorAssignmentRepository mentorAssignmentRepository;
    private final UserService userService;
    private final MatchingService matchingService;

    public MentorshipService(UserRepository userRepository,
                             TeamRepository teamRepository,
                             TeamMemberRepository teamMemberRepository,
                             ProjectSkillRepository projectSkillRepository,
                             UserSkillRepository userSkillRepository,
                             MentorAssignmentRepository mentorAssignmentRepository,
                             UserService userService,
                             @Lazy MatchingService matchingService) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.projectSkillRepository = projectSkillRepository;
        this.userSkillRepository = userSkillRepository;
        this.mentorAssignmentRepository = mentorAssignmentRepository;
        this.userService = userService;
        this.matchingService = matchingService;
    }

    @Transactional
    public void clearAllAssignments() {
        mentorAssignmentRepository.deleteAll();
    }

    /**
     * Assigns mentors to teams using the gap-coverage formula:
     * gapCoverage = proportion of team missing skills the mentor covers (>= required level)
     * domainMatch = domain interest / bio alignment
     * score = 0.7 * gapCoverage + 0.3 * domainMatch
     */
    @Transactional
    public void assignMentorsToTeams(List<Team> teams) {
        clearAllAssignments();

        List<User> mentors = userRepository.findByRole(Role.MENTOR);
        if (mentors.isEmpty() || teams.isEmpty()) {
            return;
        }

        // Keep track of current mentor load against their capacity
        Map<Long, Integer> mentorLoadMap = new HashMap<>();
        for (User m : mentors) {
            mentorLoadMap.put(m.getId(), 0);
        }

        // For all (team, mentor) pairs, compute score
        List<MentorAssignmentCandidate> allPairings = new ArrayList<>();

        for (Team team : teams) {
            List<ProjectSkill> teamSkillGaps = findTeamSkillGaps(team);

            for (User mentor : mentors) {
                PairingScore scoreResult = calculateMentorScore(mentor, team, teamSkillGaps);

                MentorAssignment candidate = new MentorAssignment(
                        team,
                        mentor,
                        scoreResult.score,
                        scoreResult.gapCoverage,
                        scoreResult.domainMatch,
                        false,
                        String.join(", ", scoreResult.coveredSkillNames)
                );
                allPairings.add(new MentorAssignmentCandidate(candidate, scoreResult.score));
            }
        }

        // Save all cell pairings in repository so the Mentorship Matrix can inspect them
        List<MentorAssignment> savedAssignments = mentorAssignmentRepository.saveAll(
                allPairings.stream().map(c -> c.assignment).collect(Collectors.toList())
        );

        // Assign best mentor to each team greedily respecting mentor capacity
        // Sort pairs by score descending
        savedAssignments.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));

        Set<Long> assignedTeamIds = new HashSet<>();
        for (MentorAssignment ma : savedAssignments) {
            Long teamId = ma.getTeam().getId();
            Long mentorId = ma.getMentor().getId();
            int currentLoad = mentorLoadMap.getOrDefault(mentorId, 0);
            int capacity = ma.getMentor().getCapacity() != null ? ma.getMentor().getCapacity() : 2;

            if (!assignedTeamIds.contains(teamId) && currentLoad < capacity) {
                ma.setIsAssigned(true);
                mentorAssignmentRepository.save(ma);

                Team team = ma.getTeam();
                team.setMentor(ma.getMentor());
                teamRepository.save(team);

                assignedTeamIds.add(teamId);
                mentorLoadMap.put(mentorId, currentLoad + 1);
            }
        }
    }

    /**
     * Builds the signature Mentorship Matrix heatmap data:
     * rows = mentors, columns = teams, cells = gap score & assignment status
     */
    public MentorshipMatrixDto getMentorshipMatrix() {
        List<User> mentors = userRepository.findByRole(Role.MENTOR);
        List<Team> teams = teamRepository.findAll();

        List<UserDto> mentorDtos = mentors.stream().map(userService::toDto).collect(Collectors.toList());
        List<TeamDto> teamDtos = teams.stream().map(matchingService::toTeamDto).collect(Collectors.toList());

        List<MatrixCellDto> cells = new ArrayList<>();

        for (User mentor : mentors) {
            List<UserSkill> mentorSkills = userSkillRepository.findByUser(mentor);
            Map<Long, Integer> mentorSkillMap = mentorSkills.stream()
                    .collect(Collectors.toMap(us -> us.getSkill().getId(), UserSkill::getLevel, (a, b) -> a));

            for (Team team : teams) {
                List<ProjectSkill> teamSkillGaps = findTeamSkillGaps(team);
                PairingScore scoreResult = calculateMentorScore(mentor, team, teamSkillGaps);

                Optional<MentorAssignment> assignmentOpt = mentorAssignmentRepository.findByTeamAndMentor(team, mentor);
                boolean isAssigned = assignmentOpt.map(MentorAssignment::getIsAssigned)
                        .orElse(team.getMentor() != null && team.getMentor().getId().equals(mentor.getId()));

                MatrixCellDto cell = new MatrixCellDto();
                cell.setMentorId(mentor.getId());
                cell.setMentorName(mentor.getName());
                cell.setTeamId(team.getId());
                cell.setTeamName(team.getName());
                cell.setProjectTitle(team.getProject().getTitle());
                cell.setScore(scoreResult.score);
                cell.setGapCoverage(scoreResult.gapCoverage);
                cell.setDomainMatch(scoreResult.domainMatch);
                cell.setIsAssigned(isAssigned);
                cell.setCoveredGaps(scoreResult.coveredSkillNames);

                cells.add(cell);
            }
        }

        return new MentorshipMatrixDto(mentorDtos, teamDtos, cells);
    }

    public List<TeamDto> getAssignedTeamsForMentor(Long mentorId) {
        User mentor = userRepository.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Mentor not found with id: " + mentorId));
        return teamRepository.findByMentor(mentor).stream()
                .map(matchingService::toTeamDto)
                .collect(Collectors.toList());
    }

    /**
     * Determines which project skills are NOT adequately met by the team members.
     */
    public List<ProjectSkill> findTeamSkillGaps(Team team) {
        List<ProjectSkill> requiredSkills = projectSkillRepository.findByProject(team.getProject());
        List<TeamMember> members = teamMemberRepository.findByTeam(team);
        List<ProjectSkill> gaps = new ArrayList<>();

        for (ProjectSkill ps : requiredSkills) {
            int reqLevel = ps.getRequiredLevel();
            int maxStudentLevel = 0;

            for (TeamMember member : members) {
                List<UserSkill> studentSkills = userSkillRepository.findByUser(member.getStudent());
                for (UserSkill us : studentSkills) {
                    if (us.getSkill().getId().equals(ps.getSkill().getId())) {
                        maxStudentLevel = Math.max(maxStudentLevel, us.getLevel());
                    }
                }
            }

            // If the team's best level is below required level, it's a skill gap!
            if (maxStudentLevel < reqLevel) {
                gaps.add(ps);
            }
        }

        return gaps;
    }

    /**
     * Computes mentor-to-team matching score:
     * score = 0.7 * gapCoverage + 0.3 * domainMatch
     */
    public PairingScore calculateMentorScore(User mentor, Team team, List<ProjectSkill> gaps) {
        List<UserSkill> mentorSkills = userSkillRepository.findByUser(mentor);
        Map<Long, Integer> mentorSkillMap = mentorSkills.stream()
                .collect(Collectors.toMap(us -> us.getSkill().getId(), UserSkill::getLevel, (a, b) -> a));

        List<String> coveredSkills = new ArrayList<>();
        double gapCoverage = 1.0;

        if (!gaps.isEmpty()) {
            int coveredCount = 0;
            for (ProjectSkill gap : gaps) {
                int mentorLvl = mentorSkillMap.getOrDefault(gap.getSkill().getId(), 0);
                if (mentorLvl >= gap.getRequiredLevel()) {
                    coveredCount++;
                    coveredSkills.add(gap.getSkill().getName() + " (Lvl " + mentorLvl + ")");
                }
            }
            gapCoverage = (double) coveredCount / (double) gaps.size();
        } else {
            // Team already has no gaps! Check general required skills
            List<ProjectSkill> reqs = projectSkillRepository.findByProject(team.getProject());
            for (ProjectSkill ps : reqs) {
                int mentorLvl = mentorSkillMap.getOrDefault(ps.getSkill().getId(), 0);
                if (mentorLvl >= 4) {
                    coveredSkills.add(ps.getSkill().getName() + " (Expert Lvl " + mentorLvl + ")");
                }
            }
        }

        // Domain match
        double domainMatch = 0.3;
        String projectDomain = team.getProject().getDomain() != null ? team.getProject().getDomain().toLowerCase() : "";
        String mentorInterests = mentor.getInterests() != null ? mentor.getInterests().toLowerCase() : "";
        String mentorBio = mentor.getBio() != null ? mentor.getBio().toLowerCase() : "";

        if (mentorInterests.contains(projectDomain) || projectDomain.contains(mentorInterests) || mentorBio.contains(projectDomain)) {
            domainMatch = 1.0;
        } else {
            String[] tokens = projectDomain.split("[,;\\s/]+");
            for (String t : tokens) {
                if (t.length() > 2 && (mentorInterests.contains(t) || mentorBio.contains(t))) {
                    domainMatch = 0.75;
                    break;
                }
            }
        }

        double rawScore = (0.7 * gapCoverage) + (0.3 * domainMatch);
        double finalScore = Math.round(rawScore * 1000.0) / 10.0;
        double finalCoverage = Math.round(gapCoverage * 1000.0) / 10.0;
        double finalDomain = Math.round(domainMatch * 1000.0) / 10.0;

        return new PairingScore(finalScore, finalCoverage, finalDomain, coveredSkills);
    }

    public static class PairingScore {
        public final double score;
        public final double gapCoverage;
        public final double domainMatch;
        public final List<String> coveredSkillNames;

        public PairingScore(double score, double gapCoverage, double domainMatch, List<String> coveredSkillNames) {
            this.score = score;
            this.gapCoverage = gapCoverage;
            this.domainMatch = domainMatch;
            this.coveredSkillNames = coveredSkillNames;
        }
    }

    private static class MentorAssignmentCandidate {
        final MentorAssignment assignment;
        final double score;

        MentorAssignmentCandidate(MentorAssignment assignment, double score) {
            this.assignment = assignment;
            this.score = score;
        }
    }
}
