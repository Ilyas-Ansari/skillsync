import React, { useState, useEffect } from 'react';
import { getRecommendedProjects } from '../api/client';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  Users, 
  Layers, 
  ArrowUpRight, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function ProjectRecommendations({ currentUser }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormulaInfo, setShowFormulaInfo] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  useEffect(() => {
    if (currentUser?.id) {
      loadRecommendations();
    }
  }, [currentUser]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const data = await getRecommendedProjects(currentUser.id);
      setRecommendations(data);
      if (data.length > 0) {
        setExpandedProjectId(data[0].project.id);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return '#10b981'; // Emerald
    if (score >= 50) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
        <Sparkles size={32} className="animate-spin" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Evaluating your skill fit against all open projects...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles color="#818cf8" size={24} /> AI-Assisted Project Recommendations
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Ranked specifically for <strong style={{ color: '#fff' }}>{currentUser.name}</strong> using the multi-factor weighted scoring algorithm.
          </p>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowFormulaInfo(!showFormulaInfo)}
          style={{ borderColor: 'rgba(99, 102, 241, 0.4)' }}
        >
          <HelpCircle size={16} /> How Matching Works
        </button>
      </div>

      {/* Matching Formula Explainer Card */}
      {showFormulaInfo && (
        <div className="glass-card" style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <TrendingUp color="#818cf8" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#c7d2fe', marginBottom: '6px' }}>
                Weighted Scoring Mathematical Formula
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                SkillSync computes an exact normalized compatibility score between 0% and 100% using:
              </p>
              <div style={{
                background: '#0a0f1d',
                padding: '10px 14px',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: '#38bdf8',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '10px'
              }}>
                Match Score = (0.60 × SkillFit) + (0.20 × DomainInterest) + (0.20 × AvailabilityFit)
              </div>
              <ul style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: 1.6 }}>
                <li><strong>SkillFit (60%):</strong> Average of min(studentLevel, requiredLevel) / requiredLevel for each required project skill.</li>
                <li><strong>DomainInterest (20%):</strong> 100% if the project domain matches your profile interests; 80% for partial token matches; 20% baseline.</li>
                <li><strong>AvailabilityFit (20%):</strong> Min(studentHours, projectHours) / projectHours (capped at 100%).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {recommendations.map((rec, index) => {
          const { project, matchScore, skillFitScore, interestMatchScore, availabilityScore, skillBreakdown } = rec;
          const scoreColor = getScoreColor(matchScore);
          const isExpanded = expandedProjectId === project.id;

          return (
            <div
              key={project.id}
              className="glass-card"
              style={{
                padding: '24px',
                borderLeft: `4px solid ${scoreColor}`,
                cursor: 'pointer',
              }}
              onClick={() => setExpandedProjectId(isExpanded ? null : project.id)}
            >
              {/* Card Top Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: index === 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                      color: index === 0 ? '#34d399' : 'var(--text-muted)'
                    }}>
                      {index === 0 ? '★ TOP RECOMMENDATION' : `#${index + 1} MATCH`}
                    </span>
                    <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc' }}>
                      {project.domain}
                    </span>
                    <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-secondary)' }}>
                      {project.difficulty}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
                    {project.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                    {project.description}
                  </p>

                  {/* Project Meta Chips */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={15} color="#38bdf8" /> {project.hoursNeeded} hrs/wk required
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={15} color="#a855f7" /> Team Size: {project.teamSize} members
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Layers size={15} color="#10b981" /> Status: {project.status}
                    </span>
                  </div>
                </div>

                {/* Score Radial / Badge */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: `2px solid ${scoreColor}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 20px',
                  minWidth: '120px',
                  boxShadow: `0 0 20px ${scoreColor}22`
                }}>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: scoreColor }}>
                    {matchScore}%
                  </div>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Match Score
                  </div>
                </div>
              </div>

              {/* Three-Factor Breakdown Progress Bars */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Skill Fit (60%)</span>
                    <strong style={{ color: '#818cf8' }}>{skillFitScore}%</strong>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${skillFitScore}%`, height: '100%', background: '#6366f1', borderRadius: '3px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Interest (20%)</span>
                    <strong style={{ color: '#f43f5e' }}>{interestMatchScore}%</strong>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${interestMatchScore}%`, height: '100%', background: '#f43f5e', borderRadius: '3px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Availability (20%)</span>
                    <strong style={{ color: '#38bdf8' }}>{availabilityScore}%</strong>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${availabilityScore}%`, height: '100%', background: '#38bdf8', borderRadius: '3px' }} />
                  </div>
                </div>
              </div>

              {/* Expanded Skill Comparison Details */}
              {isExpanded && (
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c7d2fe', marginBottom: '12px', fontWeight: 700 }}>
                    Skill-by-Skill Competency Comparison
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                    {skillBreakdown.map((item) => {
                      const isSatisfied = item.studentLevel >= item.requiredLevel;
                      return (
                        <div
                          key={item.skillName}
                          style={{
                            background: 'rgba(0, 0, 0, 0.25)',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: `1px solid ${isSatisfied ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.skillName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Your Lvl: <strong style={{ color: isSatisfied ? '#34d399' : '#f87171' }}>{item.studentLevel}</strong> / Req: {item.requiredLevel}
                            </div>
                          </div>
                          <span className="badge" style={{
                            background: isSatisfied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: isSatisfied ? '#34d399' : '#f87171',
                            fontSize: '0.7rem'
                          }}>
                            {item.matchPercentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
