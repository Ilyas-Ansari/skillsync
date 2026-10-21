package com.skillsync.model;

import jakarta.persistence.*;

@Entity
@Table(name = "mentor_assignments")
public class MentorAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "mentor_id", nullable = false)
    private User mentor;

    @Column(nullable = false)
    private Double score; // 0 to 100

    @Column(nullable = false)
    private Double gapCoverage; // 0 to 100

    @Column(nullable = false)
    private Double domainMatch; // 0 to 100

    @Column(nullable = false)
    private Boolean isAssigned = false;

    private String coveredSkills; // e.g., "Docker, Kubernetes"

    public MentorAssignment() {
    }

    public MentorAssignment(Team team, User mentor, Double score, Double gapCoverage, Double domainMatch, Boolean isAssigned, String coveredSkills) {
        this.team = team;
        this.mentor = mentor;
        this.score = score;
        this.gapCoverage = gapCoverage;
        this.domainMatch = domainMatch;
        this.isAssigned = isAssigned;
        this.coveredSkills = coveredSkills;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public User getMentor() {
        return mentor;
    }

    public void setMentor(User mentor) {
        this.mentor = mentor;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Double getGapCoverage() {
        return gapCoverage;
    }

    public void setGapCoverage(Double gapCoverage) {
        this.gapCoverage = gapCoverage;
    }

    public Double getDomainMatch() {
        return domainMatch;
    }

    public void setDomainMatch(Double domainMatch) {
        this.domainMatch = domainMatch;
    }

    public Boolean getIsAssigned() {
        return isAssigned;
    }

    public void setIsAssigned(Boolean assigned) {
        isAssigned = assigned;
    }

    public String getCoveredSkills() {
        return coveredSkills;
    }

    public void setCoveredSkills(String coveredSkills) {
        this.coveredSkills = coveredSkills;
    }
}
