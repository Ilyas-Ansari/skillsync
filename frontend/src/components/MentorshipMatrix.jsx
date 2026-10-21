import React, { useState, useEffect } from 'react';
import { getMentorshipMatrix } from '../api/client';
import { 
  LayoutGrid, 
  Crown, 
  Sparkles, 
  Info, 
  CheckCircle, 
  ShieldCheck, 
  Users, 
  TrendingUp,
  X
} from 'lucide-react';

export default function MentorshipMatrix() {
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    loadMatrix();
  }, []);

  const loadMatrix = async () => {
    setLoading(true);
    try {
      const data = await getMentorshipMatrix();
      setMatrixData(data);
    } catch (err) {
      console.error('Failed to load mentorship matrix:', err);
    } finally {
      setLoading(false);
    }
  };

  const getHeatmapColor = (score, isAssigned) => {
    if (isAssigned) {
      return {
        bg: 'rgba(16, 185, 129, 0.35)',
        border: '#10b981',
        text: '#34d399',
        glow: '0 0 16px rgba(16, 185, 129, 0.4)'
      };
    }
    if (score >= 85) {
      return {
        bg: 'rgba(16, 185, 129, 0.25)',
        border: 'rgba(16, 185, 129, 0.5)',
        text: '#34d399',
        glow: 'none'
      };
    }
    if (score >= 65) {
      return {
        bg: 'rgba(20, 184, 166, 0.2)',
        border: 'rgba(20, 184, 166, 0.4)',
        text: '#2dd4bf',
        glow: 'none'
      };
    }
    if (score >= 45) {
      return {
        bg: 'rgba(245, 158, 11, 0.2)',
        border: 'rgba(245, 158, 11, 0.4)',
        text: '#fbbf24',
        glow: 'none'
      };
    }
    if (score >= 20) {
      return {
        bg: 'rgba(249, 115, 22, 0.15)',
        border: 'rgba(249, 115, 22, 0.3)',
        text: '#fb923c',
        glow: 'none'
      };
    }
    return {
      bg: 'rgba(100, 116, 139, 0.12)',
      border: 'rgba(100, 116, 139, 0.2)',
      text: '#94a3b8',
      glow: 'none'
    };
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
        <LayoutGrid size={36} className="animate-spin" style={{ margin: '0 auto 16px', color: 'var(--accent-primary)' }} />
        <p>Computing multidimensional Mentorship Matrix scores...</p>
      </div>
    );
  }

  if (!matrixData || !matrixData.mentors || matrixData.mentors.length === 0) {
    return (
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
        <LayoutGrid size={48} color="#64748b" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
          No Matrix Data Available
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Please make sure mentors are registered and teams are generated.
        </p>
      </div>
    );
  }

  const { mentors, teams, cells } = matrixData;

  // Build lookup map for cell by [mentorId_teamId]
  const cellMap = {};
  cells.forEach((c) => {
    cellMap[`${c.mentorId}_${c.teamId}`] = c;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title & Legend */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#c7d2fe' }}>
                SIGNATURE ALGORITHM FEATURE
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LayoutGrid color="#818cf8" size={26} /> Mentorship Matrix Heatmap
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              A 2D cross-matching grid evaluation (<strong style={{ color: '#fff' }}>{mentors.length} Mentors × {teams.length} Teams</strong>) colored by gap-coverage score.
            </p>
          </div>

          {/* Color Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0, 0, 0, 0.3)', padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Score Tiers:</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#34d399' }}>
              <span style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '3px' }} /> 85-100%
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#2dd4bf' }}>
              <span style={{ width: '12px', height: '12px', background: '#14b8a6', borderRadius: '3px' }} /> 65-84%
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#fbbf24' }}>
              <span style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '3px' }} /> 45-64%
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#fb923c' }}>
              <span style={{ width: '12px', height: '12px', background: '#f97316', borderRadius: '3px' }} /> &lt;45%
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#34d399', borderLeft: '1px solid var(--border-color)', paddingLeft: '8px' }}>
              <Crown size={14} color="#10b981" /> Assigned Match
            </span>
          </div>
        </div>

        {/* Scoring formula notice */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.02)', padding: '8px 12px', borderRadius: '6px' }}>
          <Info size={15} color="#818cf8" />
          <span>
            Cell Score Formula: <strong style={{ color: '#c7d2fe' }}>Score = 0.70 × GapCoverage + 0.30 × DomainMatch</strong>. Click any cell to inspect breakdown.
          </span>
        </div>
      </div>

      {/* Heatmap Grid Table */}
      <div className="glass-card" style={{ padding: '24px', overflowX: 'auto' }}>
        <table className="matrix-table">
          <thead>
            <tr>
              <th style={{ padding: '12px 16px', textAlign: 'left', minWidth: '220px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Mentors \ Teams
              </th>
              {teams.map((team) => (
                <th
                  key={team.id}
                  style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    minWidth: '170px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>{team.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#818cf8', marginTop: '2px' }}>{team.projectDomain}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mentors.map((mentor) => (
              <tr key={mentor.id}>
                {/* Mentor Row Header */}
                <td style={{
                  padding: '14px 16px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                    }}>
                      {mentor.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{mentor.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Capacity: {mentor.capacity} teams
                      </div>
                    </div>
                  </div>
                </td>

                {/* Team Cross-Cells */}
                {teams.map((team) => {
                  const cell = cellMap[`${mentor.id}_${team.id}`] || {
                    score: 0,
                    gapCoverage: 0,
                    domainMatch: 0,
                    isAssigned: false,
                    coveredGaps: [],
                  };
                  const styling = getHeatmapColor(cell.score, cell.isAssigned);

                  return (
                    <td
                      key={team.id}
                      className={`matrix-cell ${cell.isAssigned ? 'assigned' : ''}`}
                      onClick={() => setSelectedCell({ ...cell, mentor, team })}
                      style={{
                        background: styling.bg,
                        border: `1.5px solid ${styling.border}`,
                        boxShadow: styling.glow,
                        padding: '16px 12px',
                        verticalAlign: 'middle',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        {cell.isAssigned && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                            <Crown size={14} color="#10b981" /> Assigned
                          </div>
                        )}
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: styling.text }}>
                          {cell.score}%
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                          Gap Fit: {cell.gapCoverage}%
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected Cell Inspection Drawer / Modal */}
      {selectedCell && (
        <div className="modal-overlay" onClick={() => setSelectedCell(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={22} color="#818cf8" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Cell Match Evaluation</h3>
              </div>
              <button onClick={() => setSelectedCell(null)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 0, 0, 0.3)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Mentor Candidate</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700 }}>{selectedCell.mentor?.name || selectedCell.mentorName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Target Team</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#818cf8' }}>{selectedCell.team?.name || selectedCell.teamName}</div>
                </div>
              </div>

              {/* Score Highlight */}
              <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399' }}>
                  {selectedCell.score}%
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Combined Weighted Compatibility Score
                </div>
                {selectedCell.isAssigned && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, marginTop: '8px' }}>
                    <Crown size={14} /> Winning Optimal Assignment
                  </div>
                )}
              </div>

              {/* Factors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Skill Gap Coverage (70%)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8' }}>{selectedCell.gapCoverage}%</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Missing skills mentor covers</div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Domain Alignment (30%)</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#c084fc' }}>{selectedCell.domainMatch}%</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Project domain expertise match</div>
                </div>
              </div>

              {/* Covered Skills */}
              {selectedCell.coveredGaps && selectedCell.coveredGaps.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#34d399', fontWeight: 700, marginBottom: '8px' }}>
                    Identified Gaps Covered by this Mentor:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedCell.coveredGaps.map((gap, i) => (
                      <span key={i} className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
                        ✓ {gap}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
